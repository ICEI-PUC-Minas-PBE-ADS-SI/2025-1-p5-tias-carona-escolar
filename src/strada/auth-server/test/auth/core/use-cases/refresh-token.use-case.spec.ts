import { IRefreshTokenRepository } from '@/src/auth/core/interfaces/repositories/refresh-token.repository.interface';
import { CreateAccessTokenUseCase } from '@/src/auth/core/use-cases/create-access-token.use-case';
import { RefreshTokenUseCase } from '@/src/auth/core/use-cases/refresh-token.use-case';
import { UnauthorizedException } from '@nestjs/common';
import { RefreshToken } from '@prisma/client';

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;
  let refreshTokenRepository: jest.Mocked<IRefreshTokenRepository>;
  let createAccessTokenUseCase: jest.Mocked<CreateAccessTokenUseCase>;

  beforeEach(() => {
    refreshTokenRepository = {
      findOne: jest.fn(),
      revoke: jest.fn(),
      revokeAllByUserId: jest.fn(),
    } as unknown as jest.Mocked<IRefreshTokenRepository>;
    createAccessTokenUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateAccessTokenUseCase>;

    useCase = new RefreshTokenUseCase(
      refreshTokenRepository,
      createAccessTokenUseCase,
    );
  });

  it('should refresh the token if valid', async () => {
    const refreshToken = 'validRefreshToken';
    refreshTokenRepository.findOne.mockResolvedValue({
      id: 'id',
      email: 'test@example.com',
      userId: 'userId',
      revoked: false,
      token: refreshToken,
    });
    createAccessTokenUseCase.execute.mockResolvedValue({
      access_token: 'newAccessToken',
      expires_in: '1h',
      refresh_token: 'newRefreshToken',
      token_type: 'Bearer',
    });

    const result = await useCase.execute({
      refresh_token: refreshToken,
    });

    expect(result.access_token).toBe('newAccessToken');
  });

  it('should throw UnauthorizedException if the token is revoked', async () => {
    const refreshToken = 'revokedToken';

    refreshTokenRepository.findOne.mockResolvedValue({
      revoked: true,
    } as RefreshToken);

    await expect(
      useCase.execute({ refresh_token: refreshToken }),
    ).rejects.toThrow(new UnauthorizedException('Invalid refresh token'));
  });
});
