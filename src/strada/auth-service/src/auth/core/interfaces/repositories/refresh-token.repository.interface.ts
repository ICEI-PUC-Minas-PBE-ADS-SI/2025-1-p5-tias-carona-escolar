import { RefreshToken } from '../../entities/refresh-token.entity';

export interface IRefreshTokenRepository {
  create(data: RefreshToken): Promise<RefreshToken>;
  revoke(id: string): Promise<void>;
  findOne(refreshToken: string): Promise<RefreshToken>;
  revokeAllByUserId(userId: string): Promise<void>;
}
