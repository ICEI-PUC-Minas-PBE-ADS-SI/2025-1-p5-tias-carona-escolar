import { User } from '../entities/user.entity';
import { IUserRepository } from '../interfaces/repositories/user-repository.interface';
import { IPaginatedResponse } from '../interfaces/user/paginated-response.interface';
import { IUserProjection } from '../interfaces/user/user-projection.interface';

interface FindAllParams {
  name?: string;
  page: number;
  limit: number;
}

export class FindAllUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute({
    name,
    page,
    limit,
  }: FindAllParams): Promise<IPaginatedResponse<IUserProjection>> {
    const offset = (page - 1) * limit;
    const { users, total } = await this.userRepository.findAll({
      name,
      offset,
      limit: +limit,
    });
    users.forEach((user: User) => {
      delete user.password;
      delete user.authProvider;
    });
    return {
      data: users,
      total,
      page,
      limit,
    };
  }
}
