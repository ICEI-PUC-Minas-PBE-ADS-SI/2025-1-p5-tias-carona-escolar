import { User } from '@prisma/client';
import { IGuardianRelation } from '../user/guardian-relation.interface';
import { IUserProjection } from '../user/user-projection.interface';
import { IUserResponse } from '../user/user-response.interface';
import { UserType } from '@prisma/client';

export interface IFindAllParams {
  name?: string;
  userType?: UserType;
  city?: string;
  offset: number;
  limit: number;
}

export interface IUserRepository {
  create(user: Partial<User>): Promise<IUserResponse>;
  update(id: string, user: Partial<User>): Promise<IUserResponse>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<IUserResponse>;
  findByEmail(email: string): Promise<IUserResponse>;
  findByUsername(username: string): Promise<IUserResponse>;
  findByCpf(cpf: string): Promise<IUserResponse>;
  findAll(
    params: IFindAllParams,
  ): Promise<{ total: number; users: IUserProjection[] }>;

  // Métodos para gerenciar relações de responsabilidade
  addGuardianRelation(data: IGuardianRelation): Promise<void>;
  removeGuardianRelation(guardianId: string, minorId: string): Promise<void>;
  findGuardiansByMinor(
    minorId: string,
    pagination: { offset: number; limit: number },
  ): Promise<{ total: number; data: IUserProjection[] }>;
  findMinorsByGuardian(
    guardianId: string,
    pagination: { offset: number; limit: number },
  ): Promise<{ total: number; data: IUserProjection[] }>;
}
