import { PasswordEncoder } from '@/src/auth/infrastructure/utils/password-encoder.service';
import { IUserRepository } from '../interfaces/repositories/user-repository.interface';
import { UserResourceNotFoundException } from '../exceptions/resource-not-found.exception';
import { UserMapper } from '../mappers/user.mapper';

export class UpdateUserPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordEncoder: PasswordEncoder,
  ) {}

  async execute({
    userId,
    password,
  }: {
    userId: string;
    password: string;
  }): Promise<void> {
    const existingUser = await this.userRepository.findById(userId);

    if (!existingUser) {
      throw new UserResourceNotFoundException('User not found');
    }

    const user = UserMapper.toEntity(existingUser);

    user.password = await this.passwordEncoder.encode(password);

    await this.userRepository.update(userId, user);
  }
}
