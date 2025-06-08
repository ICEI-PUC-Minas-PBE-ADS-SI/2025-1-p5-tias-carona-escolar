import { AuthUnauthorizedException } from '../exceptions/unauthorized.exceptions';
import { IRefreshToken } from '../interfaces/refresh-token/refresh-token.interface';
import { IRefreshTokenRepository } from '../interfaces/repositories/refresh-token.repository.interface';
import { CreateAccessTokenUseCase } from './create-access-token.use-case';

export class RefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly createAccessToken: CreateAccessTokenUseCase,
  ) {}

  async execute(refreshToken: IRefreshToken) {
    const refresh_token = refreshToken.refresh_token;
    const refreshTokenRecovered =
      await this.refreshTokenRepository.findOne(refresh_token);

    if (!refreshTokenRecovered) {
      throw new AuthUnauthorizedException('Invalid refresh token');
    }
    if (refreshTokenRecovered.revoked) {
      this.refreshTokenRepository.revokeAllByUserId(
        refreshTokenRecovered.userId,
      );
      throw new AuthUnauthorizedException('Invalid refresh token');
    }

    await this.refreshTokenRepository.revoke(refreshTokenRecovered.id);

    const { email } = refreshTokenRecovered;
    return await this.createAccessToken.execute({
      email,
      password: undefined,
      authProvider: 'refreshToken',
    });
  }
}
