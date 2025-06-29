import { IUserRequest } from '../interfaces/user/user-request.interface';
import { User } from '../entities/user.entity';
import { IUserResponse } from '../interfaces/user/user-response.interface';
import { IUserProjection } from '../interfaces/user/user-projection.interface';

export class UserMapper {
  static toPartialEntity(data: IUserRequest): Partial<User> {
    // Cria uma instância parcial sem validações completas
    const partialUser: Partial<User> = {};

    if (data.name !== undefined) partialUser.name = data.name;
    if (data.email !== undefined) partialUser.email = data.email;
    if (data.username !== undefined) partialUser.username = data.username;
    if (data.password !== undefined) partialUser.password = data.password;
    if (data.imgUrl !== undefined) partialUser.imgUrl = data.imgUrl;
    if (data.cpf !== undefined) partialUser.cpf = data.cpf;
    if (data.rg !== undefined) partialUser.rg = data.rg;
    if (data.birthDate !== undefined) partialUser.birthDate = data.birthDate;
    if (data.phone !== undefined) partialUser.phone = data.phone;
    if (data.address !== undefined) partialUser.address = data.address;
    if (data.cep !== undefined) partialUser.cep = data.cep;
    if (data.city !== undefined) partialUser.city = data.city;
    if (data.state !== undefined) partialUser.state = data.state;
    if (data.userType !== undefined) partialUser.userType = data.userType;
    if (data.isActive !== undefined) partialUser.isActive = data.isActive;
    if (data.cnh !== undefined) partialUser.cnh = data.cnh;
    if (data.vehicle_model !== undefined)
      partialUser.vehicle_model = data.vehicle_model;
    if (data.vehicle_color !== undefined)
      partialUser.vehicle_color = data.vehicle_color;
    if (data.license_plate !== undefined)
      partialUser.license_plate = data.license_plate;

    return partialUser;
  }

  static toResponse(user: User): IUserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      imgUrl: user.imgUrl,
      cpf: user.cpf,
      rg: user.rg,
      birthDate: user.birthDate,
      phone: user.phone,
      address: user.address,
      cep: user.cep,
      city: user.city,
      state: user.state,
      userType: user.userType,
      createdAt: user.createdAt,
      isActive: user.isActive,
    };
  }

  static toProjection(user: User): IUserProjection {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      imgUrl: user.imgUrl,
      userType: user.userType,
    };
  }

  static toProjectionList(users: User[]): IUserProjection[] {
    return users.map((user) => this.toProjection(user));
  }
}
