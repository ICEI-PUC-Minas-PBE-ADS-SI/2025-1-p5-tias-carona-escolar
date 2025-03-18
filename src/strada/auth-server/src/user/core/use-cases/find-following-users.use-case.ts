import { IUserRepository } from '../interfaces/repositories/user-repository.interface';
import { IPaginatedResponse } from '../interfaces/user/paginated-response.interface';
import { IUserProjection } from '../interfaces/user/user-projection.interface';

export class FindFollowingUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    userId: string,
    { page, limit }: { page: number; limit: number },
  ): Promise<IPaginatedResponse<IUserProjection>> {
    const offset = (page - 1) * limit;
    limit = +limit;

    const data = await this.userRepository.findFollowingUsers(userId, {
      offset,
      limit: limit,
    });

    return {
      data: data.data,
      total: data.total,
      page,
      limit,
    };
  }
}
