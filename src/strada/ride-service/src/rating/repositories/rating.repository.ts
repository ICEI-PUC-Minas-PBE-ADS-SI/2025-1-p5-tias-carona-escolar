import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../utils/prisma.service';
import { Rating, RatingType } from '@prisma/client';
import { CreateRatingDto, UpdateRatingDto } from '../dtos';

export interface RatingFilters {
  rideId?: string;
  raterId?: string;
  ratedId?: string;
  type?: RatingType;
  minRating?: number;
  maxRating?: number;
  page?: number;
  limit?: number;
}

export interface RatingStatistics {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
  recentRatings: Rating[];
}

@Injectable()
export class RatingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRatingDto, raterId: string): Promise<Rating> {
    return await this.prisma.rating.create({
      data: {
        ...data,
        raterId,
      },
      include: {
        ride: {
          select: {
            id: true,
            driverId: true,
            departureTime: true,
            startAddress: true,
            endAddress: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Rating | null> {
    return await this.prisma.rating.findUnique({
      where: { id },
      include: {
        ride: {
          select: {
            id: true,
            driverId: true,
            departureTime: true,
            startAddress: true,
            endAddress: true,
          },
        },
      },
    });
  }

  async findByRideId(rideId: string): Promise<Rating[]> {
    return await this.prisma.rating.findMany({
      where: { rideId },
      include: {
        ride: {
          select: {
            id: true,
            driverId: true,
            departureTime: true,
            startAddress: true,
            endAddress: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByRatedId(ratedId: string, type?: RatingType): Promise<Rating[]> {
    const where: any = { ratedId };
    if (type) {
      where.type = type;
    }

    return await this.prisma.rating.findMany({
      where,
      include: {
        ride: {
          select: {
            id: true,
            driverId: true,
            departureTime: true,
            startAddress: true,
            endAddress: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByRaterId(raterId: string): Promise<Rating[]> {
    return await this.prisma.rating.findMany({
      where: { raterId },
      include: {
        ride: {
          select: {
            id: true,
            driverId: true,
            departureTime: true,
            startAddress: true,
            endAddress: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findExistingRating(
    rideId: string,
    raterId: string,
    ratedId: string,
  ): Promise<Rating | null> {
    return await this.prisma.rating.findUnique({
      where: {
        rideId_raterId_ratedId: {
          rideId,
          raterId,
          ratedId,
        },
      },
    });
  }

  async update(id: string, data: UpdateRatingDto): Promise<Rating> {
    return await this.prisma.rating.update({
      where: { id },
      data,
      include: {
        ride: {
          select: {
            id: true,
            driverId: true,
            departureTime: true,
            startAddress: true,
            endAddress: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<Rating> {
    return await this.prisma.rating.delete({
      where: { id },
    });
  }

  async findWithFilters(filters: RatingFilters): Promise<Rating[]> {
    const where: any = {};

    if (filters.rideId) where.rideId = filters.rideId;
    if (filters.raterId) where.raterId = filters.raterId;
    if (filters.ratedId) where.ratedId = filters.ratedId;
    if (filters.type) where.type = filters.type;
    if (filters.minRating || filters.maxRating) {
      where.rating = {};
      if (filters.minRating) where.rating.gte = filters.minRating;
      if (filters.maxRating) where.rating.lte = filters.maxRating;
    }

    const skip = filters.page && filters.limit ? (filters.page - 1) * filters.limit : 0;
    const take = filters.limit || 10;

    return await this.prisma.rating.findMany({
      where,
      include: {
        ride: {
          select: {
            id: true,
            driverId: true,
            departureTime: true,
            startAddress: true,
            endAddress: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async getRatingStatistics(ratedId: string, type?: RatingType): Promise<RatingStatistics> {
    const where: any = { ratedId };
    if (type) {
      where.type = type;
    }

    const [ratings, totalRatings] = await Promise.all([
      this.prisma.rating.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.rating.count({ where }),
    ]);

    const ratingDistribution = await this.prisma.rating.groupBy({
      by: ['rating'],
      where,
      _count: {
        rating: true,
      },
    });

    const distribution = {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
    };

    ratingDistribution.forEach((item) => {
      distribution[item.rating.toString() as keyof typeof distribution] = item._count.rating;
    });

    const averageRating = totalRatings > 0
      ? await this.prisma.rating.aggregate({
          where,
          _avg: { rating: true },
        }).then(result => result._avg.rating || 0)
      : 0;

    return {
      averageRating: Math.round(averageRating * 100) / 100,
      totalRatings,
      ratingDistribution: distribution,
      recentRatings: ratings,
    };
  }

  async getAverageRating(ratedId: string, type?: RatingType): Promise<number> {
    const where: any = { ratedId };
    if (type) {
      where.type = type;
    }

    const result = await this.prisma.rating.aggregate({
      where,
      _avg: { rating: true },
    });

    return Math.round((result._avg.rating || 0) * 100) / 100;
  }
}