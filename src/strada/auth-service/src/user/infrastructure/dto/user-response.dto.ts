import { IUserResponse } from '@/src/user/core/interfaces/user/user-response.interface';

export class UserResponseDto implements IUserResponse {
  id: string;
  name: string;
  email: string;
  username: string;
  imgUrl: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
