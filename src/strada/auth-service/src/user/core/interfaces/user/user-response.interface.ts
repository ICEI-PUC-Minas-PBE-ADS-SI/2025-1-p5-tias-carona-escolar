import { GuardianType, UserType } from '@prisma/client';

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  imgUrl: string;
  username: string;
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
  userType: UserType;
  createdAt?: Date;
  isActive?: boolean;
  // Relações de responsabilidade (quando incluídas)
  guardians?: Array<{
    guardian: {
      id: string;
      name: string;
      username: string;
      phone: string;
    };
    relationship: GuardianType;
    canRequestRides: boolean;
    canAcceptRides: boolean;
  }>;
  minors?: Array<{
    minor: {
      id: string;
      name: string;
      username: string;
      birthDate: Date;
    };
    relationship: GuardianType;
    canRequestRides: boolean;
    canAcceptRides: boolean;
  }>;
}
