import { IRefreshTokenCredentials } from '../interfaces/refresh-token/refresh-token-request';
import { IRefreshTokenRepository } from '../interfaces/repositories/refresh-token.repository.interface';
import { RefreshTokenMapper } from '../mappers/refresh-token.mapper';

export class CreateRefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(refreshTokenData: IRefreshTokenCredentials) {
    const refreshToken = Array.from(
      crypto.getRandomValues(new Uint8Array(48)),
      (byte) => byte.toString(16).padStart(2, '0'),
    ).join('');

    refreshTokenData.refresh_token = refreshToken;

    const refresh_token = RefreshTokenMapper.toEntity(refreshTokenData);

    return RefreshTokenMapper.toDto(
      await this.refreshTokenRepository.create(refresh_token),
    );
  }
}
