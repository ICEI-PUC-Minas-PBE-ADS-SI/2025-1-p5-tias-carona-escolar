import { IUserResponse } from '@/src/user/core/interfaces/user/user-response.interface';
import { $Enums, GuardianType } from '@prisma/client';

export class UserResponseDto implements IUserResponse {
  id: string;
  name: string;
  email: string;
  username: string;
  imgUrl: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
  password?: string;
  authProvider?: string;
  cpf?: string;
  rg?: string;
  birthDate?: Date;
  phone?: string;
  address?: string;
  cep?: string;
  city?: string;
  state?: string;
  userType: $Enums.UserType;
  createdAt?: Date;
  isActive?: boolean;
  guardians?: { guardian: { id: string; name: string; username: string; phone: string; }; relationship: GuardianType; canRequestRides: boolean; canAcceptRides: boolean; }[];
  minors?: { minor: { id: string; name: string; username: string; birthDate: Date; }; relationship: GuardianType; canRequestRides: boolean; canAcceptRides: boolean; }[];
}
