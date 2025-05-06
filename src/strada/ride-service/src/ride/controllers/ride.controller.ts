import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import {
  CreateRideData,
  SearchRideFilters,
  GeoPoint,
  BoundingBox,
} from '../repositories/ride.repository';
import { RideService } from '../services/ride.service';

@ApiTags('rides')
@Controller('rides')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ride' })
  @ApiResponse({ status: 201, description: 'Ride created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: CreateRideData })
  async createRide(@Body() createRideData: CreateRideData) {
    return await this.rideService.createRide(createRideData);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search for rides based on filters' })
  @ApiResponse({
    status: 200,
    description: 'List of rides matching the criteria',
  })
  @ApiQuery({ name: 'startLat', type: Number, required: true })
  @ApiQuery({ name: 'startLng', type: Number, required: true })
  @ApiQuery({ name: 'endLat', type: Number, required: true })
  @ApiQuery({ name: 'endLng', type: Number, required: true })
  @ApiQuery({ name: 'maxStartDistance', type: Number, required: false })
  @ApiQuery({ name: 'maxEndDistance', type: Number, required: false })
  @ApiQuery({ name: 'date', type: String, required: false })
  @ApiQuery({ name: 'seats', type: Number, required: false })
  @ApiQuery({ name: 'maxPrice', type: Number, required: false })
  @ApiQuery({ name: 'allowSmoking', type: Boolean, required: false })
  @ApiQuery({ name: 'allowPets', type: Boolean, required: false })
  @ApiQuery({ name: 'allowLuggage', type: Boolean, required: false })
  @ApiQuery({
    name: 'sortBy',
    enum: ['distance', 'price', 'time', 'rating'],
    required: false,
  })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async searchRides(@Query() filters: SearchRideFilters) {
    return await this.rideService.searchRides(filters);
  }

  @Post('search/route-similarity')
  @ApiOperation({ summary: 'Search rides by route similarity' })
  @ApiResponse({
    status: 200,
    description: 'List of rides with similar routes',
  })
  @ApiBody({ type: [GeoPoint], description: 'Array of route points' })
  @ApiQuery({ name: 'maxRouteDistance', type: Number, required: true })
  @ApiQuery({ name: 'minSimilarity', type: Number, required: true })
  @ApiQuery({ name: 'date', type: String, required: false })
  @ApiQuery({ name: 'seats', type: Number, required: false })
  async searchByRouteSimilarity(
    @Body() routePoints: GeoPoint[],
    @Query('maxRouteDistance') maxRouteDistance: number,
    @Query('minSimilarity') minSimilarity: number,
    @Query('date') date?: string,
    @Query('seats') seats: number = 1,
  ) {
    return await this.rideService.searchByRouteSimilarity(
      routePoints,
      maxRouteDistance,
      minSimilarity,
      date,
      seats,
    );
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update ride status' })
  @ApiResponse({ status: 200, description: 'Ride status updated' })
  @ApiResponse({ status: 404, description: 'Ride not found' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: String, description: 'New status' })
  async updateRideStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return await this.rideService.updateRideStatus(id, status);
  }

  @Put(':id/location')
  @ApiOperation({ summary: 'Update ride location' })
  @ApiResponse({ status: 200, description: 'Ride location updated' })
  @ApiResponse({ status: 404, description: 'Ride not found' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: GeoPoint })
  async updateRideLocation(
    @Param('id') id: string,
    @Body('latitude') latitude: number,
    @Body('longitude') longitude: number,
  ) {
    return await this.rideService.updateRideLocation(id, latitude, longitude);
  }

  @Get('popular-routes')
  @ApiOperation({ summary: 'Get popular routes' })
  @ApiResponse({ status: 200, description: 'List of popular routes' })
  @ApiQuery({ name: 'startLat', type: Number, required: true })
  @ApiQuery({ name: 'startLng', type: Number, required: true })
  @ApiQuery({ name: 'radius', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getPopularRoutes(
    @Query('startLat') startLat: number,
    @Query('startLng') startLng: number,
    @Query('radius') radius: number = 5000,
    @Query('limit') limit: number = 10,
  ) {
    return await this.rideService.getPopularRoutes(
      startLat,
      startLng,
      radius,
      limit,
    );
  }

  @Post('heatmap')
  @ApiOperation({ summary: 'Get ride density heatmap' })
  @ApiResponse({ status: 200, description: 'Ride density heatmap data' })
  @ApiBody({ type: BoundingBox })
  @ApiQuery({ name: 'gridSize', type: Number, required: false })
  @ApiQuery({ name: 'dateFrom', type: String, required: false })
  @ApiQuery({ name: 'dateTo', type: String, required: false })
  async getRideDensityHeatmap(
    @Body() bounds: BoundingBox,
    @Query('gridSize') gridSize: number = 1000,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return await this.rideService.getRideDensityHeatmap(
      bounds,
      gridSize,
      dateFrom,
      dateTo,
    );
  }

  @Post('dynamic-price')
  @ApiOperation({ summary: 'Calculate dynamic price for a ride' })
  @ApiResponse({ status: 200, description: 'Dynamic price calculation' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        startLocation: {
          type: 'object',
          properties: {
            latitude: { type: 'number' },
            longitude: { type: 'number' },
          },
        },
        endLocation: {
          type: 'object',
          properties: {
            latitude: { type: 'number' },
            longitude: { type: 'number' },
          },
        },
        waypoints: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              latitude: { type: 'number' },
              longitude: { type: 'number' },
            },
          },
        },
        departureTime: { type: 'string', format: 'date-time' },
        seats: { type: 'number' },
      },
    },
  })
  async calculateDynamicPrice(
    @Body('startLocation') startLocation: GeoPoint,
    @Body('endLocation') endLocation: GeoPoint,
    @Body('waypoints') waypoints: GeoPoint[] = [],
    @Body('departureTime') departureTime: Date,
    @Body('seats') seats: number,
  ) {
    return await this.rideService.calculateDynamicPrice(
      startLocation,
      endLocation,
      waypoints,
      departureTime,
      seats,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ride by ID' })
  @ApiResponse({ status: 200, description: 'Ride details' })
  @ApiResponse({ status: 404, description: 'Ride not found' })
  @ApiParam({ name: 'id', type: String })
  async findRideById(@Param('id') id: string) {
    return await this.rideService.findRideById(id);
  }
}
