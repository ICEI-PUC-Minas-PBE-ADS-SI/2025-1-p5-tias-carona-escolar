import { IPasswordEncoder } from '../../../auth/core/interfaces/utils/password-encoder.interface';
import { IUserRepository } from '../interfaces/repositories/user-repository.interface';
import { IUserRequest } from '../interfaces/user/user-request.interface';
import { IUserResponse } from '../interfaces/user/user-response.interface';
import { UserMapper } from '../mappers/user.mapper';
import { UserDuplicateresourceException } from '../exceptions/duplicate-resource.exception';

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordEncoder: IPasswordEncoder,
  ) {}

  async execute(dto: IUserRequest): Promise<IUserResponse> {
    const user = UserMapper.toEntity(dto);
    await this.validateEmail(dto.email);
    await this.validateUsername(dto.username);

    if (!dto.authProvider || dto.authProvider === 'local') {
      user.password = await this.passwordEncoder.encode(dto.password);
    }

    const data = await this.userRepository.create(user);
    delete data.password;
    return data;
  }

  private async validateEmail(email: string): Promise<void> {
    const userExists = await this.userRepository.findByEmail(email);
    if (userExists) {
      throw new UserDuplicateresourceException(
        'User with this email already exists',
      );
    }
  }

  private async validateUsername(username: string): Promise<void> {
    const userExists = await this.userRepository.findByUsername(username);
    if (userExists) {
      throw new UserDuplicateresourceException(
        'User with this username already exists',
      );
    }
  }
}
