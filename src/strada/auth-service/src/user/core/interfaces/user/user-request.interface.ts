import { UserType } from '@prisma/client';

export interface IUserRequest {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  imgUrl?: string;
  authProvider?: string;
  cpf?: string;
  rg?: string;
  cnh?: string;
  birthDate?: Date;
  phone?: string;
  address?: string;
  cep?: string;
  city?: string;
  state?: string;
  userType?: UserType;
  isActive?: boolean;

  vehicle_model?: string;
  vehicle_color?: string;
  license_plate?: string;
}
