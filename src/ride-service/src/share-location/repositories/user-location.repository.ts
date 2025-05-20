import { PrismaService } from '@/src/utils/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

interface LocationUpdate {
  latitude: number;
  longitude: number;
  timestamp: Date;
  speed?: number; // km/h
  heading?: number; // degrees 0-360
  accuracy?: number; // meters
}

interface LocationHistory {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  speed?: number;
  heading?: number;
  accuracy?: number;
  rideId?: string;
}

interface GeoPoint {
  latitude: number;
  longitude: number;
}

@Injectable()
export class UserLocationRepository {
  constructor(private prisma: PrismaService) {}

  async updateLocation(
    userId: string,
    location: LocationUpdate,
    rideId?: string,
  ): Promise<void> {
    const point = `POINT(${location.longitude} ${location.latitude})`;

    await this.prisma.$executeRaw`
        INSERT INTO actual_path_points (id, ride_id, user_id, point, timestamp, speed, heading, accuracy, "order")
        VALUES (
          ${crypto.randomUUID()},
          ${userId},
          ${rideId ?? ''},
          ST_GeomFromText(${point}, 4326),
          ${location.timestamp},
          ${location.speed},
          ${location.heading},
          ${location.accuracy},
          (
            SELECT COALESCE(MAX("order") + 1, 1)
            FROM actual_path_points
            WHERE ride_id = ${rideId ?? ''}
          )
        )`;
  }

  async getCurrentLocation(userId: string): Promise<LocationHistory | null> {
    const ride = await this.prisma.ride.findFirst({
      where: { driverId: userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });

    if (!ride) return null;

    const actualPathPoint = await this.prisma.actualPathPoint.findFirst({
      where: { rideId: ride.id },
      orderBy: { timestamp: 'desc' },
      select: {
        id: true,
        rideId: true,
        timestamp: true,
        speed: true,
        heading: true,
        accuracy: true,
      },
    });

    if (!actualPathPoint) return null;

    const location = await this.prisma.$queryRaw<
      { latitude: number; longitude: number }[]
    >`
      SELECT ST_Y(point) as latitude, ST_X(point) as longitude
      FROM actual_path_points
      WHERE id = ${actualPathPoint.id}
    `;

    if (!location || location.length === 0) return null;

    return {
      id: actualPathPoint.id,
      userId,
      latitude: location[0].latitude,
      longitude: location[0].longitude,
      timestamp: actualPathPoint.timestamp,
      speed: actualPathPoint.speed,
      heading: actualPathPoint.heading,
      accuracy: actualPathPoint.accuracy,
      rideId: actualPathPoint.rideId,
    };
  }

  async getLocationHistory(
    userId: string,
    fromDate?: Date,
    toDate?: Date,
    rideId?: string,
  ): Promise<LocationHistory[]> {
    const where: any = {};
    if (rideId) {
      where.rideId = rideId;
    } else {
      const rides = await this.prisma.ride.findMany({
        where: { driverId: userId },
        select: { id: true },
      });
      where.rideId = { in: rides.map((r) => r.id) };
    }

    if (fromDate || toDate) {
      where.timestamp = {};
      if (fromDate) where.timestamp.gte = fromDate;
      if (toDate) where.timestamp.lte = toDate;
    }

    const actualPathPoints = await this.prisma.actualPathPoint.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 1000,
      select: {
        id: true,
        rideId: true,
        timestamp: true,
        speed: true,
        heading: true,
        accuracy: true,
      },
    });

    if (actualPathPoints.length === 0) return [];

    const locations = await this.prisma.$queryRaw<
      { id: string; latitude: number; longitude: number }[]
    >`
      SELECT id, ST_Y(point) as latitude, ST_X(point) as longitude
      FROM actual_path_points
      WHERE id IN (${Prisma.join(actualPathPoints.map((p) => p.id))})
    `;

    return actualPathPoints.map((point) => {
      const location = locations.find((loc) => loc.id === point.id);
      return {
        id: point.id,
        userId,
        latitude: location?.latitude ?? 0,
        longitude: location?.longitude ?? 0,
        timestamp: point.timestamp,
        speed: point.speed,
        heading: point.heading,
        accuracy: point.accuracy,
        rideId: point.rideId,
      };
    });
  }

  async findNearbyUsers(
    centerLat: number,
    centerLng: number,
    radiusMeters: number = 5000,
    excludeUserId?: string,
  ): Promise<
    {
      userId: string;
      latitude: number;
      longitude: number;
      distance: number;
      timestamp: Date;
    }[]
  > {
    const centerPoint = `POINT(${centerLng} ${centerLat})`;
    const excludeClause = excludeUserId
      ? Prisma.sql`AND r.driver_id != ${excludeUserId}`
      : Prisma.sql``;

    const query = Prisma.sql`
      SELECT
        r.driver_id as user_id,
        ST_Y(app.point) as latitude,
        ST_X(app.point) as longitude,
        app.timestamp,
        ST_Distance(app.point, ST_GeomFromText(${centerPoint}, 4326)) as distance
      FROM (
        SELECT
          ride_id,
          point,
          timestamp,
          ROW_NUMBER() OVER (PARTITION BY ride_id ORDER BY timestamp DESC) as rn
        FROM actual_path_points
        WHERE point IS NOT NULL
        AND timestamp > NOW() - INTERVAL '1 hour'
      ) app
      JOIN rides r ON app.ride_id = r.id
      WHERE app.rn = 1
      AND ST_DWithin(app.point, ST_GeomFromText(${centerPoint}, 4326), ${radiusMeters})
      ${excludeClause}
      ORDER BY distance ASC
    `;

    return this.prisma.$queryRaw(query);
  }

  async getDriverLocationForRide(rideId: string): Promise<{
    rideId: string;
    driverId: string;
    latitude: number;
    longitude: number;
    timestamp: Date;
  } | null> {
    const ride = await this.prisma.ride.findUnique({
      where: { id: rideId },
      select: {
        id: true,
        driverId: true,
      },
    });

    if (!ride) return null;

    const actualPathPoint = await this.prisma.actualPathPoint.findFirst({
      where: { rideId: ride.id },
      orderBy: { timestamp: 'desc' },
      select: {
        id: true,
        timestamp: true,
      },
    });

    if (!actualPathPoint) return null;

    const location = await this.prisma.$queryRaw<
      { latitude: number; longitude: number }[]
    >`
      SELECT ST_Y(point) as latitude, ST_X(point) as longitude
      FROM actual_path_points
      WHERE id = ${actualPathPoint.id}
    `;

    if (!location || location.length === 0) return null;

    return {
      rideId: ride.id,
      driverId: ride.driverId,
      latitude: location[0].latitude,
      longitude: location[0].longitude,
      timestamp: actualPathPoint.timestamp,
    };
  }

  async trackRouteProgress(
    rideId: string,
    currentLocation: GeoPoint,
  ): Promise<{
    progressPercentage: number;
    progressFraction: number;
    distanceFromStart: number;
    remainingDistance: number;
  } | null> {
    const ride = await this.prisma.$queryRaw<
      {
        id: string;
        planned_route: string;
        estimated_distance: number;
        start_point: string;
      }[]
    >`
      SELECT
        id,
        ST_AsText(planned_route) as planned_route,
        estimated_distance,
        ST_AsText(start_point) as start_point
      FROM rides
      WHERE id = ${rideId}
    `;

    if (
      !ride ||
      ride.length === 0 ||
      !ride[0].planned_route ||
      !ride[0].start_point
    )
      return null;

    const rideData = ride[0];
    const currentPoint = `POINT(${currentLocation.longitude} ${currentLocation.latitude})`;

    const progressQuery = Prisma.sql`
      SELECT
        ST_LineLocatePoint(
          ST_GeomFromText(${rideData.planned_route}, 4326),
          ST_GeomFromText(${currentPoint}, 4326)
        ) as progress_fraction,
        ST_Distance(
          ST_GeomFromText(${rideData.start_point}, 4326),
          ST_GeomFromText(${currentPoint}, 4326)
        ) as distance_from_start
    `;

    const result =
      await this.prisma.$queryRaw<
        { progress_fraction: number; distance_from_start: number }[]
      >(progressQuery);

    if (result.length === 0) return null;

    const progressFraction = result[0].progress_fraction || 0;
    const distanceFromStart = result[0].distance_from_start || 0;
    const progressPercentage = Math.round(progressFraction * 100);

    return {
      progressPercentage,
      progressFraction,
      distanceFromStart: Math.round(distanceFromStart),
      remainingDistance: Math.max(
        0,
        rideData.estimated_distance - Math.round(distanceFromStart),
      ),
    };
  }

  async calculateETA(
    rideId: string,
    currentLocation: GeoPoint,
    averageSpeed: number = 30,
  ): Promise<{
    estimatedArrival: Date;
    remainingDistance: number;
    remainingTimeMinutes: number;
  } | null> {
    const ride = await this.prisma.$queryRaw<
      {
        id: string;
        end_point: string;
      }[]
    >`
      SELECT
        id,
        ST_AsText(end_point) as end_point
      FROM rides
      WHERE id = ${rideId}
    `;

    const routePoints = await this.prisma.routePoint.findMany({
      where: {
        rideId,
        isDropoff: true,
      },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        rideId: true,
        order: true,
        address: true,
        isPickup: true,
        isDropoff: true,
      },
    });

    if (!ride || ride.length === 0 || !ride[0].end_point) return null;

    const currentPoint = `POINT(${currentLocation.longitude} ${currentLocation.latitude})`;

    // Use next dropoff point or end_point
    const nextDestination =
      routePoints.length > 0
        ? await this.prisma.$queryRaw<
            { point: string }[]
          >`SELECT ST_AsText(point) as point FROM route_points WHERE id = ${routePoints[0].id}`
        : [{ point: ride[0].end_point }];

    if (!nextDestination[0]?.point) return null;

    const destinationPoint = Prisma.sql`ST_GeomFromText(${nextDestination[0].point}, 4326)`;

    const distanceQuery = Prisma.sql`
      SELECT ST_Distance(
        ST_GeomFromText(${currentPoint}, 4326),
        ${destinationPoint}
      ) as distance
    `;

    const result =
      await this.prisma.$queryRaw<{ distance: number }[]>(distanceQuery);
    const remainingDistance = result[0]?.distance || 0;

    const speedMs = (averageSpeed * 1000) / 3600;
    const etaSeconds = remainingDistance / speedMs;
    const etaDate = new Date(Date.now() + etaSeconds * 1000);

    return {
      estimatedArrival: etaDate,
      remainingDistance: Math.round(remainingDistance),
      remainingTimeMinutes: Math.round(etaSeconds / 60),
    };
  }

  async getLocationClusters(
    bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
    clusterRadius: number = 500,
  ): Promise<
    {
      cluster_id: number;
      point_count: number;
      user_count: number;
      center_lng: number;
      center_lat: number;
      min_lng: number;
      min_lat: number;
      max_lng: number;
      max_lat: number;
    }[]
  > {
    const { minLat, maxLat, minLng, maxLng } = bounds;

    const query = Prisma.sql`
      WITH location_points AS (
        SELECT
          r.driver_id as user_id,
          app.point as location,
          app.timestamp
        FROM actual_path_points app
        JOIN rides r ON app.ride_id = r.id
        WHERE ST_Within(
          app.point,
          ST_MakeEnvelope(${minLng}, ${minLat}, ${maxLng}, ${maxLat}, 4326)
        )
        AND app.timestamp > NOW() - INTERVAL '24 hours'
      ),
      clusters AS (
        SELECT
          ST_ClusterKMeans(location, 10) OVER() as cluster_id,
          location,
          user_id
        FROM location_points
      )
      SELECT
        cluster_id,
        COUNT(*) as point_count,
        COUNT(DISTINCT user_id) as user_count,
        ST_X(ST_Centroid(ST_Collect(location))) as center_lng,
        ST_Y(ST_Centroid(ST_Collect(location))) as center_lat,
        ST_XMin(ST_Envelope(ST_Collect(location))) as min_lng,
        ST_YMin(ST_Envelope(ST_Collect(location))) as min_lat,
        ST_XMax(ST_Envelope(ST_Collect(location))) as max_lng,
        ST_YMax(ST_Envelope(ST_Collect(location))) as max_lat
      FROM clusters
      GROUP BY cluster_id
      ORDER BY point_count DESC
    `;

    return this.prisma.$queryRaw(query);
  }

  async cleanupOldLocations(daysToKeep: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    return this.prisma.actualPathPoint.deleteMany({
      where: {
        timestamp: {
          lt: cutoffDate,
        },
      },
    });
  }

  async getLocationAccuracyStats(userId: string, fromDate?: Date) {
    const where: any = {};
    const rides = await this.prisma.ride.findMany({
      where: { driverId: userId },
      select: { id: true },
    });

    where.rideId = { in: rides.map((r) => r.id) };
    if (fromDate) {
      where.timestamp = { gte: fromDate };
    }

    const stats = await this.prisma.actualPathPoint.aggregate({
      where,
      _avg: { accuracy: true },
      _min: { accuracy: true },
      _max: { accuracy: true },
      _count: { accuracy: true },
    });

    return {
      averageAccuracy: stats._avg.accuracy,
      minAccuracy: stats._min.accuracy,
      maxAccuracy: stats._max.accuracy,
      totalReadings: stats._count.accuracy,
    };
  }

  async findLocationGaps(
    userId: string,
    rideId: string,
    maxGapMinutes: number = 5,
  ): Promise<
    { id: string; timestamp: Date; prev_timestamp: Date; gap_minutes: number }[]
  > {
    const query = Prisma.sql`
      WITH location_gaps AS (
        SELECT
          id,
          timestamp,
          LAG(timestamp) OVER (ORDER BY timestamp) as prev_timestamp,
          EXTRACT(EPOCH FROM (timestamp - LAG(timestamp) OVER (ORDER BY timestamp)))/60 as gap_minutes
        FROM actual_path_points
        WHERE ride_id = ${rideId}
        ORDER BY timestamp
      )
      SELECT
        id,
        timestamp,
        prev_timestamp,
        gap_minutes
      FROM location_gaps
      WHERE gap_minutes > ${maxGapMinutes}
      ORDER BY gap_minutes DESC
    `;

    return this.prisma.$queryRaw(query);
  }
}
