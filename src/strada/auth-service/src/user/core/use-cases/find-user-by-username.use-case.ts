import { UserResourceNotFoundException } from '../exceptions/resource-not-found.exception';
import { IUserRepository } from '../interfaces/repositories/user-repository.interface';
import { IUserResponse } from '../interfaces/user/user-response.interface';

export class FindUserByUsernameUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(username: string): Promise<IUserResponse> {
    const userExists = await this.userRepository.findByUsername(username);
    if (!userExists) {
      throw new UserResourceNotFoundException(`User not found: ${username}`);
    }
    return userExists;
  }
}
