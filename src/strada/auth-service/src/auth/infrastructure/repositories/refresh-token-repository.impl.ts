import { PrismaService } from '@/src/utils/prisma.service';
import { IRefreshTokenRepository } from '../../core/interfaces/repositories/refresh-token.repository.interface';
import { RefreshToken } from '../../core/entities/refresh-token.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: RefreshToken): Promise<RefreshToken> {
    return await this.prismaService.refreshToken.create({ data });
  }
  async revoke(id: string): Promise<void> {
    await this.prismaService.refreshToken.update({
      where: { id },
      data: { revoked: true },
    });
  }
  async findOne(refreshToken: string): Promise<RefreshToken> {
    return await this.prismaService.refreshToken.findFirst({
      where: { token: refreshToken },
    });
  }
  async revokeAllByUserId(userId: string): Promise<void> {
    await this.prismaService.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    });
  }
}
