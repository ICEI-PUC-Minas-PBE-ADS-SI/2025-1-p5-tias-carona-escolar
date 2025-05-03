import { UserType, GuardianType } from '@prisma/client';

export interface IUserProjection {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  phone?: string;
  city?: string;
  state?: string;
  userType: UserType;
  birthDate?: Date;
  createdAt?: Date;
  isActive?: boolean;
  // Campos específicos para relações de responsabilidade
  relationship?: GuardianType;
  canRequestRides?: boolean;
  canAcceptRides?: boolean;
}
