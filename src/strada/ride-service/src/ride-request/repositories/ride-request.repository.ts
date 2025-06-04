import { PrismaService } from '@/src/utils/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, RequestStatus } from '@prisma/client';
import * as cuid from 'cuid';

interface GeoPoint {
  latitude: number;
  longitude: number;
}

interface LocationDto extends GeoPoint {
  address: string;
}

interface CreateRideRequestData {
  rideId: string;
  passengerId: string;
  seatsNeeded: number;
  message?: string;
  pickupLocation?: LocationDto;
  dropoffLocation?: LocationDto;
}

interface RideRequestWithDistances {
  id: string;
  rideId: string;
  passengerId: string;
  seatsNeeded: number;
  status: string;
  pickupDistance?: number;
  dropoffDistance?: number;
  additionalDistance?: number;
  detourPercentage?: number;
  createdAt: Date;
  message?: string;
}

@Injectable()
export class RideRequestRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRideRequestData): Promise<RideRequestWithDistances> {
    let pickupDistance = 0;
    let dropoffDistance = 0;
    let additionalDistance = 0;
    let detourPercentage = 0;

    // If custom locations are provided, calculate distances and detour
    if (data.pickupLocation && data.dropoffLocation) {
      const ride = await this.prisma.$queryRaw<
        {
          id: string;
          startPoint: string;
          endPoint: string;
          estimatedDistance: number;
        }[]
      >`
        SELECT
          id,
          ST_AsText(start_point) as startPoint,
          ST_AsText(end_point) as endPoint,
          estimated_distance as estimatedDistance
        FROM rides
        WHERE id = ${data.rideId}
      `;

      if (!ride || ride.length === 0) {
        throw new Error('Ride not found');
      }

      const rideData = ride[0];
      const startCoords = this.extractPointCoordinatesFromText(
        rideData.startPoint,
      );
      const endCoords = this.extractPointCoordinatesFromText(rideData.endPoint);

      if (startCoords && endCoords) {
        const distances = await this.calculateDistancesAndDetour(
          startCoords,
          endCoords,
          data.pickupLocation,
          data.dropoffLocation,
          rideData.estimatedDistance,
        );

        pickupDistance = distances.pickupDistance;
        dropoffDistance = distances.dropoffDistance;
        additionalDistance = distances.additionalDistance;
        detourPercentage = distances.detourPercentage;
      }
    }

    const pickupPoint = data.pickupLocation
      ? `POINT(${data.pickupLocation.longitude} ${data.pickupLocation.latitude})`
      : null;

    const dropoffPoint = data.dropoffLocation
      ? `POINT(${data.dropoffLocation.longitude} ${data.dropoffLocation.latitude})`
      : null;

      const request = await this.prisma.$queryRaw<
      {
        id: string;
        ride_id: string;
        passenger_id: string;
        seats_needed: number;
        status: string;
        created_at: Date;
        updated_at: Date;
        message?: string;
        requested_pickup_address?: string;
        requested_dropoff_address?: string;
      }[]
    >(
      Prisma.sql`
        INSERT INTO ride_requests (
          id,
          ride_id,
          passenger_id,
          seats_needed,
          message,
          status,
          requested_pickup_address,
          requested_dropoff_address,
          requested_pickup_point,
          requested_dropoff_point,
          created_at,
          updated_at
        )
        VALUES (
          ${cuid()},
          ${data.rideId},
          ${data.passengerId},
          ${data.seatsNeeded},
          ${data.message ?? null},
          'PENDING',
          ${data.pickupLocation?.address ?? null},
          ${data.dropoffLocation?.address ?? null},
          ${pickupPoint ? Prisma.sql`ST_GeomFromText(${pickupPoint}, 4326)` : Prisma.sql`NULL`},
          ${dropoffPoint ? Prisma.sql`ST_GeomFromText(${dropoffPoint}, 4326)` : Prisma.sql`NULL`},
          ${new Date()},
          ${new Date()}
        )
        RETURNING id, ride_id, passenger_id, seats_needed, status, created_at, updated_at, message, requested_pickup_address, requested_dropoff_address
      `,
    );

    if (!request || request.length === 0) {
      throw new Error('Failed to create ride request');
    }

    const createdRequest = request[0];

    return {
      id: createdRequest.id,
      rideId: createdRequest.ride_id,
      passengerId: createdRequest.passenger_id,
      seatsNeeded: createdRequest.seats_needed,
      status: createdRequest.status,
      pickupDistance,
      dropoffDistance,
      additionalDistance,
      detourPercentage,
      createdAt: createdRequest.created_at,
      message: createdRequest.message,
    };
  }

  async findById(id: string) {
    return this.prisma.rideRequest.findUnique({
      where: { id },
      include: { ride: true },
    });
  }

  async findByRideId(rideId: string) {
    return this.prisma.rideRequest.findMany({
      where: { rideId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findByPassengerId(passengerId: string, status?: string) {
    const where: any = { passengerId };
    if (status) {
      where.status = status;
    }

    return this.prisma.rideRequest.findMany({
      where,
      include: { ride: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.rideRequest.update({
      where: { id },
      data: {
        status: status as RequestStatus,
        respondedAt: status !== 'PENDING' ? new Date() : null,
      },
    });
  }

  async acceptRequest(id: string) {
    const request = await this.findById(id);
    if (!request) {
      throw new Error('Request not found');
    }

    const ride = await this.prisma.ride.findUnique({
      where: { id: request.rideId },
      select: { availableSeats: true },
    });

    if (!ride || ride.availableSeats < request.seatsNeeded) {
      throw new Error('Not enough available seats');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedRequest = await tx.rideRequest.update({
        where: { id },
        data: {
          status: 'ACCEPTED',
          respondedAt: new Date(),
        },
      });

      await tx.ride.update({
        where: { id: request.rideId },
        data: {
          availableSeats: {
            decrement: request.seatsNeeded,
          },
        },
      });

      const remainingSeats = ride.availableSeats - request.seatsNeeded;
      if (remainingSeats <= 0) {
        await tx.rideRequest.updateMany({
          where: {
            rideId: request.rideId,
            status: 'PENDING',
            id: { not: id },
          },
          data: {
            status: 'REJECTED',
            respondedAt: new Date(),
          },
        });
      }

      return updatedRequest;
    });
  }

  async rejectRequest(id: string) {
    return this.prisma.rideRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        respondedAt: new Date(),
      },
    });
  }

  async cancelRequest(id: string) {
    const request = await this.findById(id);
    if (!request) {
      throw new Error('Request not found');
    }

    if (request.status === 'ACCEPTED') {
      return this.prisma.$transaction(async (tx) => {
        const cancelledRequest = await tx.rideRequest.update({
          where: { id },
          data: {
            status: 'CANCELLED',
            respondedAt: new Date(),
          },
        });

        await tx.ride.update({
          where: { id: request.rideId },
          data: {
            availableSeats: {
              increment: request.seatsNeeded,
            },
          },
        });

        return cancelledRequest;
      });
    } else {
      return this.prisma.rideRequest.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          respondedAt: new Date(),
        },
      });
    }
  }

  async getRequestsWithinRadius(
    centerLat: number,
    centerLng: number,
    radiusMeters: number = 5000,
  ) {
    const centerPoint = `POINT(${centerLng} ${centerLat})`;

    const query = `
      SELECT
        rr.*,
        ST_Distance(rr.requested_pickup_point, ST_GeomFromText('${centerPoint}', 4326)) as distance_from_center,
        r.start_address,
        r.end_address,
        r.departure_time,
        u.name as passenger_name,
        u.rating as passenger_rating
      FROM ride_requests rr
      JOIN rides r ON rr.ride_id = r.id
      JOIN users u ON rr.passenger_id = u.id
      WHERE rr.requested_pickup_point IS NOT NULL
      AND ST_DWithin(rr.requested_pickup_point, ST_GeomFromText('${centerPoint}', 4326), ${radiusMeters})
      AND rr.status = 'PENDING'
      ORDER BY distance_from_center ASC
    `;

    return this.prisma.$queryRawUnsafe(query);
  }

  async getRequestsByRoute(routeGeometry: string, maxDistance: number = 1000) {
    const query = `
      SELECT
        rr.*,
        ST_Distance(rr.requested_pickup_point, ST_GeomFromText('${routeGeometry}', 4326)) as pickup_route_distance,
        ST_Distance(rr.requested_dropoff_point, ST_GeomFromText('${routeGeometry}', 4326)) as dropoff_route_distance,
        r.start_address,
        r.end_address,
        r.departure_time,
        u.name as passenger_name,
        u.rating as passenger_rating
      FROM ride_requests rr
      JOIN rides r ON rr.ride_id = r.id
      JOIN users u ON rr.passenger_id = u.id
      WHERE rr.requested_pickup_point IS NOT NULL
      AND rr.requested_dropoff_point IS NOT NULL
      AND ST_DWithin(rr.requested_pickup_point, ST_GeomFromText('${routeGeometry}', 4326), ${maxDistance})
      AND ST_DWithin(rr.requested_dropoff_point, ST_GeomFromText('${routeGeometry}', 4326), ${maxDistance})
      AND rr.status = 'PENDING'
      ORDER BY pickup_route_distance ASC
    `;

    return this.prisma.$queryRawUnsafe(query);
  }

  async getRequestStatistics(rideId?: string, passengerId?: string) {
    let whereClause = '';
    const conditions: string[] = [];

    if (rideId) {
      conditions.push(`ride_id = '${rideId}'`);
    }
    if (passengerId) {
      conditions.push(`passenger_id = '${passengerId}'`);
    }
    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    const query = `
      SELECT
        status,
        COUNT(*) as count,
        AVG(EXTRACT(EPOCH FROM (responded_at - created_at))/60) as avg_response_time_minutes
      FROM ride_requests
      ${whereClause}
      GROUP BY status
    `;

    return this.prisma.$queryRawUnsafe(query);
  }

  async findPendingRequestsForDriver(driverId: string) {
    return this.prisma.rideRequest.findMany({
      where: {
        ride: {
          driverId,
        },
        status: 'PENDING',
      },
      include: {
        ride: {
          select: {
            id: true,
            startAddress: true,
            endAddress: true,
            departureTime: true,
            availableSeats: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  private async calculateDistancesAndDetour(
    rideStart: GeoPoint,
    rideEnd: GeoPoint,
    pickupLocation: GeoPoint,
    dropoffLocation: GeoPoint,
    originalDistance: number,
  ): Promise<{
    pickupDistance: number;
    dropoffDistance: number;
    additionalDistance: number;
    detourPercentage: number;
  }> {
    const pickupDistanceQuery = `
      SELECT ST_Distance(
        ST_GeomFromText('POINT(${rideStart.longitude} ${rideStart.latitude})', 4326),
        ST_GeomFromText('POINT(${pickupLocation.longitude} ${pickupLocation.latitude})', 4326)
      ) as distance
    `;

    const dropoffDistanceQuery = `
      SELECT ST_Distance(
        ST_GeomFromText('POINT(${dropoffLocation.longitude} ${dropoffLocation.latitude})', 4326),
        ST_GeomFromText('POINT(${rideEnd.longitude} ${rideEnd.latitude})', 4326)
      ) as distance
    `;

    const newRouteDistanceQuery = `
      SELECT ST_Length(
        ST_MakeLine(ARRAY[
          ST_GeomFromText('POINT(${rideStart.longitude} ${rideStart.latitude})', 4326),
          ST_GeomFromText('POINT(${pickupLocation.longitude} ${pickupLocation.latitude})', 4326),
          ST_GeomFromText('POINT(${dropoffLocation.longitude} ${dropoffLocation.latitude})', 4326),
          ST_GeomFromText('POINT(${rideEnd.longitude} ${rideEnd.latitude})', 4326)
        ])
      ) as distance
    `;

    const [pickupResult, dropoffResult, newRouteResult] = await Promise.all([
      this.prisma.$queryRaw<{ distance: number }[]>(
        Prisma.sql`${pickupDistanceQuery}`,
      ),
      this.prisma.$queryRaw<{ distance: number }[]>(
        Prisma.sql`${dropoffDistanceQuery}`,
      ),
      this.prisma.$queryRaw<{ distance: number }[]>(
        Prisma.sql`${newRouteDistanceQuery}`,
      ),
    ]);

    const pickupDistance = Math.round(pickupResult[0]?.distance || 0);
    const dropoffDistance = Math.round(dropoffResult[0]?.distance || 0);
    const newRouteDistance = Math.round(newRouteResult[0]?.distance || 0);

    const additionalDistance = Math.max(0, newRouteDistance - originalDistance);
    const detourPercentage =
      originalDistance > 0
        ? Math.round((additionalDistance / originalDistance) * 100 * 100) / 100
        : 0;

    return {
      pickupDistance,
      dropoffDistance,
      additionalDistance,
      detourPercentage,
    };
  }

  async updatePickupStatus(
    id: string,
    status: 'ACCEPTED' | 'REJECTED' | 'ON_GOING',
  ) {
    return this.prisma.rideRequest.update({
      where: { id },
      data: {
        status,
        pickedUpAt: status === 'ON_GOING' ? new Date() : null,
      },
    });
  }

  async updateDropoffStatus(id: string, status: 'COMPLETED') {
    return this.prisma.rideRequest.update({
      where: { id },
      data: {
        status: status as RequestStatus,
        droppedOffAt: new Date(),
      },
    });
  }

  async bulkUpdateStatus(requestIds: string[], status: string) {
    return this.prisma.rideRequest.updateMany({
      where: {
        id: { in: requestIds },
      },
      data: {
        status: status as RequestStatus,
        respondedAt: new Date(),
      },
    });
  }

  // Helper to parse PostGIS POINT text
  private extractPointCoordinatesFromText(
    geometryText: string,
  ): GeoPoint | null {
    if (!geometryText) return null;

    const match = geometryText.match(/POINT\((-?\d+\.?\d*)\s(-?\d+\.?\d*)\)/);
    if (!match) {
      console.error('Invalid geometry text:', geometryText);
      return null;
    }

    return {
      longitude: parseFloat(match[1]),
      latitude: parseFloat(match[2]),
    };
  }

  async findOptimalPickupDropoffPoints(
    rideId: string,
    passengerStart: GeoPoint,
    passengerEnd: GeoPoint,
    maxDetourKm: number = 2,
  ) {
    // Fetch ride geometry data
    const ride = await this.prisma.$queryRaw<
      { startPoint: string; endPoint: string }[]
    >`
        SELECT
          ST_AsText(start_point) as startPoint,
          ST_AsText(end_point) as endPoint
        FROM rides
        WHERE id = ${rideId}
      `;

    if (!ride || ride.length === 0) {
      throw new Error('Ride not found');
    }

    // Extract coordinates from PostGIS geometry text
    const startCoords = this.extractPointCoordinatesFromText(
      ride[0].startPoint,
    );
    const endCoords = this.extractPointCoordinatesFromText(ride[0].endPoint);

    if (!startCoords || !endCoords) {
      throw new Error('Could not extract ride coordinates');
    }

    const rideStart = `POINT(${startCoords.longitude} ${startCoords.latitude})`;
    const rideEnd = `POINT(${endCoords.longitude} ${endCoords.latitude})`;
    const passengerStartPoint = `POINT(${passengerStart.longitude} ${passengerStart.latitude})`;
    const passengerEndPoint = `POINT(${passengerEnd.longitude} ${passengerEnd.latitude})`;

    // Find optimal pickup and dropoff points along the route
    const query = `
        WITH route_line AS (
          SELECT ST_MakeLine(
            ST_GeomFromText('${rideStart}', 4326),
            ST_GeomFromText('${rideEnd}', 4326)
          ) as route_geometry
        ),
        optimal_pickup AS (
          SELECT ST_ClosestPoint(
            route_geometry,
            ST_GeomFromText('${passengerStartPoint}', 4326)
          ) as pickup_point
          FROM route_line
        ),
        optimal_dropoff AS (
          SELECT ST_ClosestPoint(
            route_geometry,
            ST_GeomFromText('${passengerEndPoint}', 4326)
          ) as dropoff_point
          FROM route_line
        )
        SELECT
          ST_X(op.pickup_point) as optimal_pickup_lng,
          ST_Y(op.pickup_point) as optimal_pickup_lat,
          ST_X(od.dropoff_point) as optimal_dropoff_lng,
          ST_Y(od.dropoff_point) as optimal_dropoff_lat,
          ST_Distance(ST_GeomFromText('${passengerStartPoint}', 4326), op.pickup_point) as pickup_walk_distance,
          ST_Distance(ST_GeomFromText('${passengerEndPoint}', 4326), od.dropoff_point) as dropoff_walk_distance,
          ST_Distance(op.pickup_point, od.dropoff_point) as ride_segment_distance
        FROM optimal_pickup op, optimal_dropoff od
      `;

    const result = (await this.prisma.$queryRawUnsafe(query)) as any[];

    if (result.length === 0) {
      return null;
    }

    const optimal = result[0];

    // Check if detour is within acceptable limit
    const totalDetour =
      optimal.pickup_walk_distance + optimal.dropoff_walk_distance;
    const detourKm = totalDetour / 1000;

    if (detourKm > maxDetourKm) {
      return null;
    }

    return {
      optimalPickupPoint: {
        latitude: optimal.optimal_pickup_lat,
        longitude: optimal.optimal_pickup_lng,
      },
      optimalDropoffPoint: {
        latitude: optimal.optimal_dropoff_lat,
        longitude: optimal.optimal_dropoff_lng,
      },
      walkingDistances: {
        toPickup: Math.round(optimal.pickup_walk_distance),
        fromDropoff: Math.round(optimal.dropoff_walk_distance),
      },
      rideSegmentDistance: Math.round(optimal.ride_segment_distance),
      totalDetourKm: Math.round(detourKm * 100) / 100,
    };
  }
}
