import { RefreshToken } from '../entities/refresh-token.entity';
import { IRefreshTokenCredentials } from '../interfaces/refresh-token/refresh-token-request';
import { IRefreshToken } from '../interfaces/refresh-token/refresh-token.interface';

export class RefreshTokenMapper {
  static toEntity(refreshToken: IRefreshTokenCredentials): RefreshToken {
    return new RefreshToken({
      token: refreshToken.refresh_token,
      email: refreshToken.email,
      userId: refreshToken.userId,
    });
  }

  static toDto(refreshToken: RefreshToken): IRefreshToken {
    return {
      refresh_token: refreshToken.token,
    };
  }
}
