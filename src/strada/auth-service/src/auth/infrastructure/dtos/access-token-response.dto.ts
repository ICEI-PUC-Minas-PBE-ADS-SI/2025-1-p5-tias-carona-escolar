import { IAccessToken } from 'src/auth/core/interfaces/access-token/acces-token.interface';

export class AccessTokenResponseDto implements IAccessToken {
  access_token: string;
  token_type: string;
  expires_in: string;
  refresh_token: string;

  constructor(partial: Partial<AccessTokenResponseDto>) {
    Object.assign(this, partial);
  }
}
