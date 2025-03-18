import { IRefreshToken } from 'src/auth/core/interfaces/refresh-token/refresh-token.interface';

export class RefreshTokenRequestDto implements IRefreshToken {
  refresh_token: string;

  constructor(partial: Partial<RefreshTokenRequestDto>) {
    Object.assign(this, partial);
  }
}
