import { IUserRequest } from '@/src/user/core/interfaces/user/user-request.interface';

export class UserRequestDto implements IUserRequest {
  name: string;
  email: string;
  password: string;
  imgUrl: string;
  username: string;
  authProvider?: string;

  constructor(partial: Partial<UserRequestDto>) {
    Object.assign(this, partial);
  }
}
