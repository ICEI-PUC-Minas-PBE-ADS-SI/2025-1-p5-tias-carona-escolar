import { IRefreshTokenCredentials } from '@/src/auth/core/interfaces/refresh-token/refresh-token-request';
import { IRefreshTokenRepository } from '@/src/auth/core/interfaces/repositories/refresh-token.repository.interface';
import { RefreshTokenMapper } from '@/src/auth/core/mappers/refresh-token.mapper';
import { CreateRefreshTokenUseCase } from '@/src/auth/core/use-cases/create-refresh-token.use-case';

describe('CreateRefreshTokenUseCase', () => {
  let createRefreshTokenUseCase: CreateRefreshTokenUseCase;
  let refreshTokenRepository: jest.Mocked<IRefreshTokenRepository>;

  beforeEach(() => {
    refreshTokenRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      revoke: jest.fn(),
      revokeAllByUserId: jest.fn(),
    };
    createRefreshTokenUseCase = new CreateRefreshTokenUseCase(
      refreshTokenRepository,
    );
  });

  it('should generate a new refresh token and store it in the repository', async () => {
    const refreshTokenData: IRefreshTokenCredentials = {
      userId: 'user123',
      email: 'user@example.com',
      refresh_token: '',
    };

    refreshTokenRepository.create.mockResolvedValueOnce(
      RefreshTokenMapper.toEntity(refreshTokenData),
    );

    const result = await createRefreshTokenUseCase.execute(refreshTokenData);

    expect(refreshTokenData.refresh_token).toBeDefined();
    expect(refreshTokenData.refresh_token.length).toBeGreaterThan(0);

    expect(refreshTokenRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user123',
        email: 'user@example.com',
        token: expect.any(String),
      }),
    );

    expect(result).toEqual({ refresh_token: result.refresh_token });
  });
});
