import { IUserRequest } from '@/src/user/core/interfaces/user/user-request.interface';

export interface IOAuthProvider {
  fetchUserData(provider: string, token: string): Promise<IUserRequest>;
}
