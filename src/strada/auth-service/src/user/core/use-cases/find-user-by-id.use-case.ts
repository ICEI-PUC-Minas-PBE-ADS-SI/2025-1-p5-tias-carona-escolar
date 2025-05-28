import { UserResourceNotFoundException } from '../exceptions/resource-not-found.exception';
import { IUserRepository } from '../interfaces/repositories/user-repository.interface';
import { IUserResponse } from '../interfaces/user/user-response.interface';

export class FindUserByIdlUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<IUserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserResourceNotFoundException(`User not found: ${id}`);
    delete user.password;
    delete user.authProvider;
    return user;
  }
}
