import { IUserRequest } from '../interfaces/user/user-request.interface';
import { User } from '../entities/user.entity';
import { IUserResponse } from '../interfaces/user/user-response.interface';
import { IUserProjection } from '../interfaces/user/user-projection.interface';

export class UserMapper {
  static toEntity(dto: IUserRequest): User {
    const user = new User({
      name: dto.name,
      email: dto.email,
      authProvider: dto.authProvider ?? 'local',
      password: dto.password,
      username: dto.username,
      imgUrl: dto.imgUrl,
    });
    return user;
  }

  static toDTO(user: User): IUserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      imgUrl: user.imgUrl,
    };
  }

  static toProjection(user: User): IUserProjection {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      imgUrl: user.imgUrl,
      numberOfFollowers: user.numberOfFollowers,
      numberOfFollowings: user.numberOfFollowings,
      numberOfRecipes: user.numberOfRecipes,
    };
  }

  static toProjectionList(users: User[]): IUserProjection[] {
    return users.map((user) => this.toProjection(user));
  }
}
