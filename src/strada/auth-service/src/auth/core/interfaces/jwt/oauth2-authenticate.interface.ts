import { IUserRequest } from '@/src/user/core/interfaces/user/user-request.interface';

export interface IAuthenticationProvider {
  oauthAuthenticate(provider: string, token: string): Promise<IUserRequest>;
}
