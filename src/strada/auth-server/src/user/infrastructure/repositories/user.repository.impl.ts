import { PrismaService } from '@/src/utils/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  IUserRepository,
  IFindAllParams,
} from '../../core/interfaces/repositories/user-repository.interface';
import { IFollow } from '../../core/interfaces/user/follow-interface';
import { IUserProjection } from '../../core/interfaces/user/user-projection.interface';
import { IUserResponse } from '../../core/interfaces/user/user-response.interface';
import { User } from '../../core/entities/user.entity';

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
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        imgUrl: true,
        numberOfFollowers: true,
        numberOfFollowings: true,
        createdAt: true,
        isActive: true,
        authProvider: false,
        password: false,
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
    };

    if (user.password) {
      data.password = user.password;
    }

    return await this.prismaService.user.update({
      where: { id },
      data,
    });
  }
  async addFollower(data: IFollow): Promise<void> {
    const { followerId, followeeId } = data;

    await this.prismaService.follow.create({
      data: {
        followerId,
        followeeId,
      },
    });
  }
  async removeFollow(data: IFollow): Promise<void> {
    const { followerId, followeeId } = data;

    await this.prismaService.follow.delete({
      where: {
        followerId_followeeId: {
          followerId,
          followeeId,
        },
      },
    });
  }

  async findFollowingUsers(
    userId: string,
    { offset, limit }: { offset: number; limit: number },
  ): Promise<{ total: number; data: IUserProjection[] }> {
    const followers = await this.prismaService.follow.findMany({
      where: {
        followeeId: userId,
      },
      take: limit,
      skip: offset,
      select: {
        follower: {
          select: {
            id: true,
            name: true,
            username: true,
            imgUrl: true,
          },
        },
      },
    });

    if (!followers) {
      return { total: 0, data: [] };
    }

    const total = await this.prismaService.follow.count({
      where: {
        followeeId: userId,
      },
    });

    return {
      total,
      data: followers.map((follow) => follow.follower),
    };
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.user.delete({ where: { id } });
  }
  async findById(id: string): Promise<IUserResponse> {
    return await this.prismaService.user.findUnique({ where: { id } });
  }
  async findByEmail(email: string): Promise<IUserResponse> {
    return await this.prismaService.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string): Promise<IUserResponse> {
    return await this.prismaService.user.findUnique({ where: { username } });
  }

  async findAll(
    params: IFindAllParams,
  ): Promise<{ total: number; users: IUserProjection[] }> {
    const [users, total] = await Promise.all([
      this.prismaService.user.findMany({
        where: {
          name: {
            contains: params.name ? params.name.toLowerCase() : '',
          },
        },
        skip: params.offset,
        take: params.limit,
      }),
      this.prismaService.user.count({
        where: {
          name: {
            contains: params.name ? params.name.toLowerCase() : '',
          },
        },
      }),
    ]);
    return { total, users };
  }
}
