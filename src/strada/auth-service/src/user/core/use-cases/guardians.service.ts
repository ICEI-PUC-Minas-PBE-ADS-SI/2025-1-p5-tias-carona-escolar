import { Injectable } from '@nestjs/common';
import { IGuardianRelation } from '../interfaces/user/guardian-relation.interface';
import { IUserProjection } from '../interfaces/user/user-projection.interface';
import { GuardianType } from '@prisma/client';
import { IUserRepository } from '../interfaces/repositories/user-repository.interface';

export interface IGuardianRelationDto {
  guardianId: string;
  minorId: string;
  relationship: string;
  canRequestRides?: boolean;
  canAcceptRides?: boolean;
}

export interface IPaginationParams {
  page?: number;
  limit?: number;
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class GuardianService {
  constructor(private readonly userRepository: IUserRepository) {}

  async addGuardianRelation(relationDto: IGuardianRelationDto): Promise<void> {
    const guardianRelation: IGuardianRelation = {
      guardianId: relationDto.guardianId,
      minorId: relationDto.minorId,
      relationship: relationDto.relationship as GuardianType,
      canRequestRides: relationDto.canRequestRides ?? true,
      canAcceptRides: relationDto.canAcceptRides ?? true,
    };

    await this.userRepository.addGuardianRelation(guardianRelation);
  }

  async removeGuardianRelation(
    guardianId: string,
    minorId: string,
  ): Promise<void> {
    await this.userRepository.removeGuardianRelation(guardianId, minorId);
  }

  async findGuardiansByMinor(
    minorId: string,
    params: IPaginationParams = {},
  ): Promise<IPaginatedResponse<IUserProjection>> {
    const { page = 1, limit = 10 } = params;
    const offset = (page - 1) * limit;

    const result = await this.userRepository.findGuardiansByMinor(minorId, {
      offset,
      limit,
    });

    const totalPages = Math.ceil(result.total / limit);

    return {
      data: result.data,
      total: result.total,
      page,
      limit,
      totalPages,
    };
  }

  async findMinorsByGuardian(
    guardianId: string,
    params: IPaginationParams = {},
  ): Promise<IPaginatedResponse<IUserProjection>> {
    const { page = 1, limit = 10 } = params;
    const offset = (page - 1) * limit;

    const result = await this.userRepository.findMinorsByGuardian(guardianId, {
      offset,
      limit,
    });

    const totalPages = Math.ceil(result.total / limit);

    return {
      data: result.data,
      total: result.total,
      page,
      limit,
      totalPages,
    };
  }
}
