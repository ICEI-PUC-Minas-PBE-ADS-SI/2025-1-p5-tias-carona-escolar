import { PrismaService } from '@/src/utils/prisma.service';
import { Injectable } from '@nestjs/common';
import { RideStatus } from '@prisma/client';
import * as cuid from 'cuid';

export class GeoPoint {
  latitude: number;
  longitude: number;
}

export class LocationDto extends GeoPoint {
  address: string;
}

export class RideHistoryFilters {
  userType: 'driver' | 'passenger';
  status?: 'COMPLETED' | 'CANCELLED' | 'ALL';
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'price' | 'distance';
  sortOrder?: 'asc' | 'desc';
}

export class BoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export class RoutePoint extends GeoPoint {
  order: number;
  address?: string;
  isPickup?: boolean;
  isDropoff?: boolean;
}

export class SpatialSearchCriteria {
  center: GeoPoint;
  radius: number;
  maxStartDistance?: number;
  maxEndDistance?: number;
  routeSimilarityThreshold?: number;
}

export class CreateRideData {
  driverId: string;
  startLocation: LocationDto;
  endLocation: LocationDto;
  departureTime: Date;
  availableSeats: number;
  pricePerSeat: number;
  vehicle: {
    model: string;
    color: string;
    licensePlate: string;
  };
  preferences: {
    allowSmoking: boolean;
    allowPets: boolean;
    allowLuggage: boolean;
  };
  estimatedDuration: number;
  estimatedDistance: number;
  routePath: RoutePoint[];
}

export class SearchRideFilters {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  maxStartDistance?: number;
  maxEndDistance?: number;
  date?: string;
  seats?: number;
  maxPrice?: number;
  allowSmoking?: boolean;
  allowPets?: boolean;
  allowLuggage?: boolean;
  sortBy?: 'distance' | 'price' | 'time' | 'rating';
  page?: number;
  limit?: number;
}

@Injectable()
export class RideRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRideData) {
    // Criar geometria da rota usando PostGIS
    const routeGeometry = this.createLineStringFromPoints(data.routePath);
    const startPoint = `POINT(${data.startLocation.longitude} ${data.startLocation.latitude})`;
    const endPoint = `POINT(${data.endLocation.longitude} ${data.endLocation.latitude})`;

    // Calcular bounding box
    const boundingBox = this.calculateBoundingBox([
      data.startLocation,
      data.endLocation,
      ...data.routePath,
    ]);

    const newId = cuid();

    return await this.prisma.$executeRaw`
    INSERT INTO "rides" (
      id, driver_id, start_address, end_address,
      departure_time, available_seats, price_per_seat,
      vehicle_model, vehicle_color, license_plate,
      allow_luggage, estimated_duration, estimated_distance,
      status, start_point, end_point, planned_route, bounding_box, created_at, updated_at
    ) VALUES (
      ${newId}, ${data.driverId}, ${data.startLocation.address}, ${data.endLocation.address},
      ${data.departureTime}::timestamp, ${data.availableSeats}, ${data.pricePerSeat},
      ${data.vehicle.model}, ${data.vehicle.color}, ${data.vehicle.licensePlate},
      ${data.preferences.allowLuggage}, ${data.estimatedDuration}, ${data.estimatedDistance},
      'PENDING',
      ST_GeomFromText(${startPoint}, 4326),
      ST_GeomFromText(${endPoint}, 4326),
      ST_GeomFromText(${routeGeometry}, 4326),
      ST_MakeEnvelope(${boundingBox.minLng}, ${boundingBox.minLat}, ${boundingBox.maxLng}, ${boundingBox.maxLat}, 4326),
      now(), now()
    )
  `;
  }

  async searchRides(filters: SearchRideFilters) {
    const {
      startLat,
      startLng,
      endLat,
      endLng,
      maxStartDistance = 2000,
      maxEndDistance = 2000,
      date,
      seats = 1,
      maxPrice,
      allowLuggage,
      sortBy = 'distance',
      page = 1,
      limit = 10,
    } = filters;

    const offset = (page - 1) * limit;
    const searchStartPoint = `POINT(${startLng} ${startLat})`;
    const searchEndPoint = `POINT(${endLng} ${endLat})`;

    // Construir WHERE clause dinamicamente
    const whereConditions: string[] = [
      "r.status = 'PENDING'",
      `r.available_seats >= ${seats}`,
      `ST_DWithin(r.start_point, ST_GeomFromText('${searchStartPoint}', 4326), ${maxStartDistance})`,
      `ST_DWithin(r.end_point, ST_GeomFromText('${searchEndPoint}', 4326), ${maxEndDistance})`,
    ];

    if (date) {
      whereConditions.push(`DATE(r.departure_time) = '${date}'`);
    }

    if (maxPrice) {
      whereConditions.push(`r.price_per_seat <= ${maxPrice}`);
    }

    if (allowLuggage !== undefined) {
      whereConditions.push(`r.allow_luggage = ${allowLuggage}`);
    }

    // Definir ORDER BY baseado no sortBy
    let orderByClause = '';
    switch (sortBy) {
      case 'distance':
        orderByClause = 'ORDER BY start_distance + end_distance ASC';
        break;
      case 'price':
        orderByClause = 'ORDER BY r.price_per_seat ASC';
        break;
      case 'time':
        orderByClause = 'ORDER BY r.departure_time ASC';
        break;
    }
    const query = `
    SELECT
      r.id,
      r.driver_id,
      ST_AsText(r.start_point) as start_point_wkt,
      ST_AsText(r.end_point) as end_point_wkt,
      r.start_address,
      r.end_address,
      r.departure_time,
      r.available_seats,
      r.price_per_seat,
      r.status,
      r.vehicle_model,
      r.vehicle_color,
      r.license_plate,
      r.allow_luggage,
      r.estimated_duration,
      r.estimated_distance,
      r.actual_duration,
      r.actual_distance,
      r.actual_start_time,
      r.actual_end_time,
      ST_AsText(r.planned_route) as planned_route_wkt,
      ST_AsText(r.actual_route) as actual_route_wkt,
      ST_AsText(r.bounding_box) as bounding_box_wkt,
      r.created_at,
      r.updated_at,
      r.current_latitude,
      r.current_longitude,
      ST_AsText(r.current_location) as current_location_wkt,
      r.last_location_update,

      -- Distâncias calculadas para ordenação e filtros
      ST_Distance(r.start_point, ST_GeomFromText('${searchStartPoint}', 4326)) as start_distance,
      ST_Distance(r.end_point, ST_GeomFromText('${searchEndPoint}', 4326)) as end_distance,
      ST_Distance(r.start_point, ST_GeomFromText('${searchStartPoint}', 4326)) +
      ST_Distance(r.end_point, ST_GeomFromText('${searchEndPoint}', 4326)) as total_distance

    FROM rides r
    WHERE ${whereConditions.join(' AND ')}
    ${orderByClause}
    LIMIT ${limit} OFFSET ${offset}
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM rides r
      WHERE ${whereConditions.join(' AND ')}
    `;

    const [rides, totalResult] = await Promise.all([
      this.prisma.$queryRawUnsafe(query),
      this.prisma.$queryRawUnsafe(countQuery),
    ]);

    const total = Number((totalResult as any)[0].total);

    return {
      rides: rides as any[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
      searchCriteria: {
        searchRadius: Math.max(maxStartDistance, maxEndDistance),
        foundWithinRadius: total,
      },
    };
  }

  async searchByRouteSimilarity(
    routePoints: GeoPoint[],
    maxRouteDistance: number,
    minSimilarity: number,
    date?: string,
    seats: number = 1,
  ) {
    const routeGeometry = this.createLineStringFromPoints(
      routePoints.map((point, index) => ({ ...point, order: index + 1 })),
    );

    const whereConditions = [
      "r.status = 'PENDING'",
      `r.available_seats >= ${seats}`,
      `r.planned_route IS NOT NULL`,
      `ST_Length(r.planned_route) > 0`,
      `ST_DWithin(r.planned_route, ST_GeomFromText('${routeGeometry}', 4326), ${maxRouteDistance})`,
      // Movemos a condição de similaridade para WHERE
      `(ST_Length(ST_Intersection(r.planned_route, ST_Buffer(ST_GeomFromText('${routeGeometry}', 4326), ${maxRouteDistance}))) / ST_Length(r.planned_route)) >= ${minSimilarity}`,
    ];

    if (date) {
      whereConditions.push(`DATE(r.departure_time) = '${date}'`);
    }

    const query = `
      SELECT
        r.id,
        r.driver_id,
        ST_AsText(r.start_point) as start_point,
        ST_AsText(r.end_point) as end_point,
        r.start_address,
        r.end_address,
        r.departure_time,
        r.available_seats,
        r.price_per_seat,
        r.status,
        r.vehicle_model,
        r.vehicle_color,
        r.license_plate,
        r.allow_luggage,
        r.estimated_duration,
        r.estimated_distance,
        r.actual_duration,
        r.actual_distance,
        r.actual_start_time,
        r.actual_end_time,
        ST_AsText(r.planned_route) as planned_route,
        ST_AsText(r.actual_route) as actual_route,
        ST_AsText(r.bounding_box) as bounding_box,
        r.created_at,
        r.updated_at,
        r.current_latitude,
        r.current_longitude,
        ST_AsText(r.current_location) as current_location,
        r.last_location_update,
        ST_Length(ST_Intersection(r.planned_route, ST_Buffer(ST_GeomFromText('${routeGeometry}', 4326), ${maxRouteDistance})))::numeric(10,2) as shared_distance,
        ST_Length(r.planned_route)::numeric(10,2) as total_distance,
        (ST_Length(ST_Intersection(r.planned_route, ST_Buffer(ST_GeomFromText('${routeGeometry}', 4326), ${maxRouteDistance}))) / ST_Length(r.planned_route))::numeric(5,3) as route_similarity
      FROM rides r
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY route_similarity DESC
    `;

    return this.prisma.$queryRawUnsafe(query);
  }

  async findById(id: string) {
    const ride = await this.prisma.ride.findUnique({
      where: { id },
      include: {
        routePoints: {
          orderBy: { order: 'asc' },
        },
        requests: true,
      },
    });

    if (!ride) return null;

    // Buscar dados geométricos com raw SQL
    const geoData = await this.prisma.$queryRaw`
      SELECT
        ST_AsGeoJSON(start_point) as start_point,
        ST_AsGeoJSON(end_point) as end_point,
        ST_AsGeoJSON(planned_route) as planned_route,
        ST_AsGeoJSON(current_location) as current_location
      FROM rides
      WHERE id = ${id}
    `;

    // Combinar dados
    return {
      ...ride,
      startPoint: geoData[0]?.start_point ? JSON.parse(geoData[0].start_point) : null,
      endPoint: geoData[0]?.end_point ? JSON.parse(geoData[0].end_point) : null,
      plannedRoute: geoData[0]?.planned_route ? JSON.parse(geoData[0].planned_route) : null,
      currentLocation: geoData[0]?.current_location ? JSON.parse(geoData[0].current_location) : null,
    };
  }

  async getRideHistory(userId: string, filters: RideHistoryFilters) {
    const {
      userType,
      status = 'ALL',
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'desc',
    } = filters;

    const offset = (page - 1) * limit;
    let query = '';
    const params: any[] = [];
    let paramIndex = 1;

    if (userType === 'driver') {
      // Query para motorista - busca apenas nas rides onde ele é o driver
      query = `
          SELECT
            r.id,
            r.driver_id,
            r.start_address,
            r.end_address,
            r.departure_time,
            r.available_seats,
            r.price_per_seat,
            r.status,
            r.vehicle_model,
            r.vehicle_color,
            r.license_plate,
            r.allow_luggage,
            r.estimated_duration,
            r.estimated_distance,
            r.actual_duration,
            r.actual_distance,
            r.actual_start_time,
            r.actual_end_time,
            r.created_at,
            r.updated_at,
            -- Converte geometrias para texto legível
            ST_AsText(r.start_point) as start_point_text,
            ST_AsText(r.end_point) as end_point_text,
            ST_AsText(r.planned_route) as planned_route_text,
            -- Adiciona informações de coordenadas
            ST_X(r.start_point) as start_longitude,
            ST_Y(r.start_point) as start_latitude,
            ST_X(r.end_point) as end_longitude,
            ST_Y(r.end_point) as end_latitude
          FROM rides r
          WHERE r.driver_id = $${paramIndex++}
        `;
      params.push(userId);
    } else {
      // Query para passageiro - busca nas rides onde ele é passageiro ou fez request
      query = `
          SELECT DISTINCT
            r.id,
            r.driver_id,
            r.start_address,
            r.end_address,
            r.departure_time,
            r.available_seats,
            r.price_per_seat,
            r.status,
            r.vehicle_model,
            r.vehicle_color,
            r.license_plate,
            r.allow_luggage,
            r.estimated_duration,
            r.estimated_distance,
            r.actual_duration,
            r.actual_distance,
            r.actual_start_time,
            r.actual_end_time,
            r.created_at,
            r.updated_at,
            -- Converte geometrias para texto legível
            ST_AsText(r.start_point) as start_point_text,
            ST_AsText(r.end_point) as end_point_text,
            ST_AsText(r.planned_route) as planned_route_text,
            -- Adiciona informações de coordenadas
            ST_X(r.start_point) as start_longitude,
            ST_Y(r.start_point) as start_latitude,
            ST_X(r.end_point) as end_longitude,
            ST_Y(r.end_point) as end_latitude,
            -- Informações do passageiro (se existir)
            rp.passenger_id,
            rp.seats_booked,
            rp.total_paid,
            rp.status as passenger_status,
            rp.joined_at,
            rp.picked_up_at,
            rp.dropped_off_at,
            -- Informações do request (se existir)
            rr.status as request_status,
            rr.seats_needed,
            rr.message as request_message
          FROM rides r
          LEFT JOIN ride_passengers rp ON r.id = rp.ride_id AND rp.passenger_id = $${paramIndex++}
          LEFT JOIN ride_requests rr ON r.id = rr.ride_id AND rr.passenger_id = $${paramIndex++}
          WHERE (rp.passenger_id IS NOT NULL OR rr.passenger_id IS NOT NULL)
        `;
      params.push(userId, userId);
    }

    // Adiciona filtro de status
    if (status !== 'ALL') {
      query += ` AND r.status = $${paramIndex++}`;
      params.push(status);
    }

    // Adiciona filtros de data
    if (dateFrom) {
      query += ` AND DATE(r.departure_time) >= $${paramIndex++}`;
      params.push(dateFrom);
    }

    if (dateTo) {
      query += ` AND DATE(r.departure_time) <= $${paramIndex++}`;
      params.push(dateTo);
    }

    // Adiciona ordenação
    switch (sortBy) {
      case 'date':
        query += ` ORDER BY r.departure_time ${sortOrder.toUpperCase()}`;
        break;
      case 'price':
        query += ` ORDER BY r.price_per_seat ${sortOrder.toUpperCase()}`;
        break;
      case 'distance':
        query += ` ORDER BY r.estimated_distance ${sortOrder.toUpperCase()}`;
        break;
      default:
        query += ` ORDER BY r.departure_time ${sortOrder.toUpperCase()}`;
    }

    // Adiciona paginação
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const results = await this.prisma.$queryRawUnsafe(query, ...params);
    return results;
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.ride.update({
      where: { id },
      data: { status: status as RideStatus },
    });
  }

  async updateLocation(id: string, latitude: number, longitude: number) {
    const point = `POINT(${longitude} ${latitude})`;

    return await this.prisma.$executeRawUnsafe(
      `
      UPDATE "rides"
      SET "current_latitude" = $1,
          "current_longitude" = $2,
          "current_location" = ST_GeomFromText($3, 4326),
          "last_location_update" = $4
      WHERE "id" = $5
    `,
      latitude,
      longitude,
      `POINT(${longitude} ${latitude})`,
      new Date(),
      id,
    );
  }

  async getPopularRoutes(
    startLat: number,
    startLng: number,
    radius: number = 5000,
    limit: number = 10,
  ) {
    const centerPoint = `POINT(${startLng} ${startLat})`;

    const query = `
      SELECT
        r.start_address,
        r.end_address,
        COUNT(*) as ride_count,
        AVG(r.price_per_seat) as avg_price,
        AVG(r.estimated_duration) as avg_duration,
        AVG(r.estimated_distance) as avg_distance,
        MAX(r.created_at) as last_ride_date,
        ST_AsText(ST_Centroid(ST_Collect(r.planned_route))) as route_geometry
      FROM rides r
      WHERE ST_DWithin(r.start_point, ST_GeomFromText('${centerPoint}', 4326), ${radius})
      GROUP BY r.start_address, r.end_address
      ORDER BY ride_count DESC
      LIMIT ${limit}
    `;

    const result = await this.prisma.$queryRawUnsafe(query);
    return this.serializeBigInt(result);
  }

  private readonly serializeBigInt = (obj: any) => {
    if (Array.isArray(obj)) {
      return obj.map(this.serializeBigInt);
    } else if (obj !== null && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          key,
          typeof value === 'bigint' ? value.toString() : value,
        ]),
      );
    }
    return obj;
  };

  async getRideDensityHeatmap(
    bounds: BoundingBox,
    gridSize: number = 1000,
    dateFrom?: string,
    dateTo?: string,
  ) {
    const { minLat, maxLat, minLng, maxLng } = bounds;

    let dateFilter = '';
    if (dateFrom && dateTo) {
      dateFilter = `AND r.created_at BETWEEN '${dateFrom}' AND '${dateTo}'`;
    }

    const query = `
      WITH grid AS (
        SELECT
          ST_SnapToGrid(r.start_point, ${gridSize}) as grid_point,
          COUNT(*) as ride_count,
          AVG(r.price_per_seat) as avg_price
        FROM rides r
        WHERE ST_Within(r.start_point, ST_MakeEnvelope(${minLng}, ${minLat}, ${maxLng}, ${maxLat}, 4326))
        ${dateFilter}
        GROUP BY ST_SnapToGrid(r.start_point, ${gridSize})
      )
      SELECT
        ST_X(grid_point) as center_lng,
        ST_Y(grid_point) as center_lat,
        ride_count,
        avg_price,
        ST_XMin(ST_Envelope(ST_Buffer(grid_point, ${gridSize / 2}))) as min_lng,
        ST_YMin(ST_Envelope(ST_Buffer(grid_point, ${gridSize / 2}))) as min_lat,
        ST_XMax(ST_Envelope(ST_Buffer(grid_point, ${gridSize / 2}))) as max_lng,
        ST_YMax(ST_Envelope(ST_Buffer(grid_point, ${gridSize / 2}))) as max_lat
      FROM grid
      ORDER BY ride_count DESC
    `;

    return this.prisma.$queryRawUnsafe(query);
  }

  async calculateDynamicPrice(
    startLocation: GeoPoint,
    endLocation: GeoPoint,
    waypoints: GeoPoint[] = [],
    departureTime: Date,
    seats: number,
  ) {
    const routePoints = [startLocation, ...waypoints, endLocation];
    const routeGeometry = this.createLineStringFromPoints(
      routePoints.map((point, index) => ({ ...point, order: index + 1 })),
    );

    // Calcular distância total da rota
    const distanceQuery = `
      SELECT ST_Length(ST_GeomFromText('${routeGeometry}', 4326)) as distance
    `;

    const distanceResult = (await this.prisma.$queryRawUnsafe(
      distanceQuery,
    )) as any[];
    const distance = distanceResult[0]?.distance || 0;

    // Buscar preços médios de rotas similares
    const buffer = 2000; // 2km buffer
    const marketAnalysisQuery = `
      SELECT
        AVG(price_per_seat) as avg_price,
        COUNT(*) as competitor_count
      FROM rides
      WHERE ST_DWithin(planned_route, ST_GeomFromText('${routeGeometry}', 4326), ${buffer})
      AND departure_time >= NOW() - INTERVAL '30 days'
    `;

    const marketResult = (await this.prisma.$queryRawUnsafe(
      marketAnalysisQuery,
    )) as any[];
    const avgPrice = marketResult[0]?.avg_price || 25;
    const competitorCount = marketResult[0]?.competitor_count || 0;

    // Calcular pricing dinâmico
    const baseFare = 15;
    const distanceFare = (distance / 1000) * 2.5; // R$ 2.5 por km
    const timeFare = this.calculateTimeFare(new Date(departureTime)) || 0; // Taxa de tempo no rush

    const suggestedPrice = baseFare + distanceFare + timeFare;

    return {
      suggestedPrice: Math.round(suggestedPrice * 100) / 100,
      priceBreakdown: {
        baseFare,
        distanceFare: Math.round(distanceFare * 100) / 100,
        timeFare: Math.round(timeFare * 100) / 100,
      },
      marketAnalysis: {
        averagePrice: Math.round(avgPrice * 100) / 100,
        demandLevel:
          competitorCount > 5 ? 'high' : competitorCount > 2 ? 'medium' : 'low',
        competitorCount,
      },
      routeInfo: {
        distance: Math.round(distance),
        estimatedDuration: Math.round((distance / 1000) * 2), // estimativa: 2 min por km
        routeGeometry,
      },
    };
  }

  private createLineStringFromPoints(
    points: (GeoPoint & { order: number })[],
  ): string {
    const sortedPoints = points.sort((a, b) => a.order - b.order);
    const coordinates = sortedPoints
      .map((p) => `${p.longitude} ${p.latitude}`)
      .join(', ');
    return `LINESTRING(${coordinates})`;
  }

  private calculateBoundingBox(points: GeoPoint[]): BoundingBox {
    const lats = points.map((p) => p.latitude);
    const lngs = points.map((p) => p.longitude);

    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    };
  }

  private calculateTimeFare(departureTime: Date): number {
    const hour = departureTime.getHours();
    // Hora do rush: 7-9h e 17-19h
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      return 5; // Taxa adicional no rush
    }
    return 0;
  }
}
