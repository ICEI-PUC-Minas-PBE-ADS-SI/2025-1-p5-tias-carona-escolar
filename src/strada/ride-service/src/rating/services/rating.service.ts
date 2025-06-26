import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { RatingRepository, RatingFilters, RatingStatistics } from '../repositories/rating.repository';
import { CreateRatingDto, UpdateRatingDto } from '../dtos';
import { RatingType } from '@prisma/client';

@Injectable()
export class RatingService {
  constructor(private readonly ratingRepository: RatingRepository) {}

  async createRating(data: CreateRatingDto, raterId: string) {
    const existingRating = await this.ratingRepository.findExistingRating(
      data.rideId,
      raterId,
      data.ratedId,
    );

    if (existingRating) {
      throw new ConflictException('Você já avaliou esta pessoa nesta corrida');
    }

    const rating = await this.ratingRepository.create(data, raterId);

    return {
      success: true,
      data: rating,
      message: 'Avaliação criada com sucesso',
    };
  }

  async getRatingById(id: string) {
    const rating = await this.ratingRepository.findById(id);

    if (!rating) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    return {
      success: true,
      data: rating,
    };
  }

  async getRatingsByRideId(rideId: string) {
    const ratings = await this.ratingRepository.findByRideId(rideId);

    return {
      success: true,
      data: ratings,
      count: ratings.length,
    };
  }

  async getRatingsByRatedId(ratedId: string, type?: RatingType) {
    const ratings = await this.ratingRepository.findByRatedId(ratedId, type);

    return {
      success: true,
      data: ratings,
      count: ratings.length,
    };
  }

  async getRatingsByRaterId(raterId: string) {
    const ratings = await this.ratingRepository.findByRaterId(raterId);

    return {
      success: true,
      data: ratings,
      count: ratings.length,
    };
  }

  async updateRating(id: string, data: UpdateRatingDto, userId: string) {
    const existingRating = await this.ratingRepository.findById(id);

    if (!existingRating) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    if (existingRating.raterId !== userId) {
      throw new BadRequestException('Você só pode editar suas próprias avaliações');
    }

    const updatedRating = await this.ratingRepository.update(id, data);

    return {
      success: true,
      data: updatedRating,
      message: 'Avaliação atualizada com sucesso',
    };
  }

  async deleteRating(id: string, userId: string) {
    const existingRating = await this.ratingRepository.findById(id);

    if (!existingRating) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    // Verificar se o usuário é o autor da avaliação
    if (existingRating.raterId !== userId) {
      throw new BadRequestException('Você só pode excluir suas próprias avaliações');
    }

    await this.ratingRepository.delete(id);

    return {
      success: true,
      message: 'Avaliação excluída com sucesso',
    };
  }

  async getRatingsWithFilters(filters: RatingFilters) {
    const ratings = await this.ratingRepository.findWithFilters(filters);

    return {
      success: true,
      data: ratings,
      count: ratings.length,
      filters,
    };
  }

  async getRatingStatistics(ratedId: string, type?: RatingType): Promise<RatingStatistics> {
    return await this.ratingRepository.getRatingStatistics(ratedId, type);
  }

  async getAverageRating(ratedId: string, type?: RatingType): Promise<number> {
    return await this.ratingRepository.getAverageRating(ratedId, type);
  }

  async getRatingSummary(ratedId: string) {
    const [driverStats, passengerStats] = await Promise.all([
      this.ratingRepository.getRatingStatistics(ratedId, RatingType.DRIVER_TO_PASSENGER),
      this.ratingRepository.getRatingStatistics(ratedId, RatingType.PASSENGER_TO_DRIVER),
    ]);

    return {
      success: true,
      data: {
        asDriver: driverStats,
        asPassenger: passengerStats,
        overall: {
          averageRating: this.calculateOverallAverage(driverStats, passengerStats),
          totalRatings: driverStats.totalRatings + passengerStats.totalRatings,
        },
      },
    };
  }

  private calculateOverallAverage(driverStats: RatingStatistics, passengerStats: RatingStatistics): number {
    const totalRatings = driverStats.totalRatings + passengerStats.totalRatings;

    if (totalRatings === 0) return 0;

    const totalScore = (driverStats.averageRating * driverStats.totalRatings) +
                      (passengerStats.averageRating * passengerStats.totalRatings);

    return Math.round((totalScore / totalRatings) * 100) / 100;
  }
}