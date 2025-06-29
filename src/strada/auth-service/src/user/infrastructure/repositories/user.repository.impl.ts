import { PrismaService } from '@/src/utils/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import {
  IUserRepository,
  IFindAllParams,
} from '../../core/interfaces/repositories/user-repository.interface';
import { IUserProjection } from '../../core/interfaces/user/user-projection.interface';
import { IUserResponse } from '../../core/interfaces/user/user-response.interface';
import { IGuardianRelation } from '../../core/interfaces/user/guardian-relation.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: User): Promise<IUserResponse> {
    const createdUser = await this.prismaService.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        imgUrl: user.imgUrl,
        username: user.username,
        createdAt: user.createdAt,
        authProvider: user.authProvider,
        cpf: user.cpf,
        rg: user.rg,
        cnh: user.cnh,
        birthDate: user.birthDate,
        phone: user.phone,
        address: user.address,
        cep: user.cep,
        city: user.city,
        state: user.state,
        userType: user.userType,
        vehicle_model: user.vehicle_model,
        vehicle_color: user.vehicle_color,
        license_plate: user.license_plate,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        imgUrl: true,
        cpf: true,
        rg: true,
        cnh: true,
        birthDate: true,
        phone: true,
        address: true,
        cep: true,
        city: true,
        state: true,
        userType: true,
        createdAt: true,
        isActive: true,
        authProvider: false,
        password: false,
        vehicle_model: true,
        vehicle_color: true,
        license_plate: true,
      },
    });

    return createdUser;
  }

  async update(id: string, user: User): Promise<IUserResponse> {
    const data: any = {
      id: user.id,
      name: user.name,
      email: user.email,
      imgUrl: user.imgUrl,
      username: user.username,
      createdAt: user.createdAt,
      authProvider: user.authProvider,
      cpf: user.cpf,
      rg: user.rg,
      cnh: user.cnh,
      birthDate: user.birthDate,
      phone: user.phone,
      address: user.address,
      cep: user.cep,
      city: user.city,
      state: user.state,
      userType: user.userType,
      vehicle_model: user.vehicle_model,
      vehicle_color: user.vehicle_color,
      license_plate: user.license_plate,
    };

    if (user.password) {
      data.password = user.password;
    }

    return await this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  async addGuardianRelation(data: IGuardianRelation): Promise<void> {
    const {
      guardianId,
      minorId,
      relationship,
      canRequestRides,
      canAcceptRides,
    } = data;

    await this.prismaService.guardian.create({
      data: {
        guardianId,
        minorId,
        relationship,
        canRequestRides,
        canAcceptRides,
      },
    });
  }

  async removeGuardianRelation(
    guardianId: string,
    minorId: string,
  ): Promise<void> {
    await this.prismaService.guardian.delete({
      where: {
        guardianId_minorId: {
          guardianId,
          minorId,
        },
      },
    });
  }

  async findGuardiansByMinor(
    minorId: string,
    { offset, limit }: { offset: number; limit: number },
  ): Promise<{ total: number; data: IUserProjection[] }> {
    const guardians = await this.prismaService.guardian.findMany({
      where: {
        minorId,
      },
      take: limit,
      skip: offset,
      select: {
        guardian: {
          select: {
            id: true,
            name: true,
            username: true,
            imgUrl: true,
            phone: true,
            userType: true,
          },
        },
        relationship: true,
        canRequestRides: true,
        canAcceptRides: true,
      },
    });

    if (!guardians) {
      return { total: 0, data: [] };
    }

    const total = await this.prismaService.guardian.count({
      where: {
        minorId,
      },
    });

    return {
      total,
      data: guardians.map((relation) => ({
        ...relation.guardian,
        relationship: relation.relationship,
        canRequestRides: relation.canRequestRides,
        canAcceptRides: relation.canAcceptRides,
      })),
    };
  }

  async findMinorsByGuardian(
    guardianId: string,
    { offset, limit }: { offset: number; limit: number },
  ): Promise<{ total: number; data: IUserProjection[] }> {
    const minors = await this.prismaService.guardian.findMany({
      where: {
        guardianId,
      },
      take: limit,
      skip: offset,
      select: {
        minor: {
          select: {
            id: true,
            name: true,
            username: true,
            imgUrl: true,
            birthDate: true,
            userType: true,
          },
        },
        relationship: true,
        canRequestRides: true,
        canAcceptRides: true,
      },
    });

    if (!minors) {
      return { total: 0, data: [] };
    }

    const total = await this.prismaService.guardian.count({
      where: {
        guardianId,
      },
    });

    return {
      total,
      data: minors.map((relation) => ({
        ...relation.minor,
        relationship: relation.relationship,
        canRequestRides: relation.canRequestRides,
        canAcceptRides: relation.canAcceptRides,
      })),
    };
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.user.delete({ where: { id } });
  }

  async findById(id: string): Promise<IUserResponse> {
    return await this.prismaService.user.findUnique({
      where: { id },
      include: {
        guardians: {
          include: {
            guardian: {
              select: {
                id: true,
                name: true,
                username: true,
                phone: true,
              },
            },
          },
        },
        minors: {
          include: {
            minor: {
              select: {
                id: true,
                name: true,
                username: true,
                birthDate: true,
              },
            },
          },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<IUserResponse> {
    return await this.prismaService.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string): Promise<IUserResponse> {
    return await this.prismaService.user.findUnique({ where: { username } });
  }

  async findByCpf(cpf: string): Promise<IUserResponse> {
    return await this.prismaService.user.findUnique({ where: { cpf } });
  }

  async findAll(
    params: IFindAllParams,
  ): Promise<{ total: number; users: IUserProjection[] }> {
    const whereClause: any = {};

    if (params.name) {
      whereClause.name = {
        contains: params.name.toLowerCase(),
        mode: 'insensitive',
      };
    }

    if (params.userType) {
      whereClause.userType = params.userType;
    }

    if (params.city) {
      whereClause.city = {
        contains: params.city.toLowerCase(),
        mode: 'insensitive',
      };
    }

    const [users, total] = await Promise.all([
      this.prismaService.user.findMany({
        where: whereClause,
        skip: params.offset,
        take: params.limit,
        select: {
          id: true,
          name: true,
          username: true,
          imgUrl: true,
          phone: true,
          city: true,
          state: true,
          userType: true,
          birthDate: true,
          createdAt: true,
          isActive: true,
        },
      }),
      this.prismaService.user.count({
        where: whereClause,
      }),
    ]);

    return { total, users };
  }
}
