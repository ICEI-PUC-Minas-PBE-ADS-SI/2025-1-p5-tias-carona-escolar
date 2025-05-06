import { Injectable, NotFoundException } from '@nestjs/common';
import {
  BoundingBox,
  CreateRideData,
  GeoPoint,
  RideRepository,
  SearchRideFilters,
} from '../repositories/ride.repository';

@Injectable()
export class RideService {
  constructor(private readonly rideRepository: RideRepository) {}

  async createRide(data: CreateRideData) {
    return await this.rideRepository.create(data);
  }

  async searchRides(filters: SearchRideFilters) {
    return await this.rideRepository.searchRides(filters);
  }

  async searchByRouteSimilarity(
    routePoints: GeoPoint[],
    maxRouteDistance: number,
    minSimilarity: number,
    date?: string,
    seats: number = 1,
  ) {
    return await this.rideRepository.searchByRouteSimilarity(
      routePoints,
      maxRouteDistance,
      minSimilarity,
      date,
      seats,
    );
  }

  async findRideById(id: string) {
    const ride = await this.rideRepository.findById(id);
    if (!ride) {
      throw new NotFoundException(`Ride with ID ${id} not found`);
    }
    return ride;
  }

  async updateRideStatus(id: string, status: string) {
    const ride = await this.rideRepository.findById(id);
    if (!ride) {
      throw new NotFoundException(`Ride with ID ${id} not found`);
    }
    return await this.rideRepository.updateStatus(id, status);
  }

  async updateRideLocation(id: string, latitude: number, longitude: number) {
    const ride = await this.rideRepository.findById(id);
    if (!ride) {
      throw new NotFoundException(`Ride with ID ${id} not found`);
    }
    return await this.rideRepository.updateLocation(id, latitude, longitude);
  }

  async getPopularRoutes(
    startLat: number,
    startLng: number,
    radius: number,
    limit: number,
  ) {
    return await this.rideRepository.getPopularRoutes(
      startLat,
      startLng,
      radius,
      limit,
    );
  }

  async getRideDensityHeatmap(
    bounds: BoundingBox,
    gridSize: number,
    dateFrom?: string,
    dateTo?: string,
  ) {
    return await this.rideRepository.getRideDensityHeatmap(
      bounds,
      gridSize,
      dateFrom,
      dateTo,
    );
  }

  async calculateDynamicPrice(
    startLocation: GeoPoint,
    endLocation: GeoPoint,
    waypoints: GeoPoint[],
    departureTime: Date,
    seats: number,
  ) {
    return await this.rideRepository.calculateDynamicPrice(
      startLocation,
      endLocation,
      waypoints,
      departureTime,
      seats,
    );
  }
}
