import { UserDomainException } from '../exceptions/domain.exception';
import { IUserRepository } from '../interfaces/repositories/user-repository.interface';
import { IUserRequest } from '../interfaces/user/user-request.interface';
import { IUserResponse } from '../interfaces/user/user-response.interface';
import { UserMapper } from '../mappers/user.mapper';
import { FindUserByIdlUserUseCase } from './find-user-by-id.use-case';

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly findUserByIdUseCase: FindUserByIdlUserUseCase,
  ) {}

  async execute(id: string, dto: IUserRequest): Promise<IUserResponse> {
    await this.findUserByIdUseCase.execute(id);
    try {
      dto.password = 'oldUser.password';
      const user = UserMapper.toEntity(dto);
      delete user.id;
      delete user.password;
      delete user.createdAt;
      return await this.userRepository.update(id, user);
    } catch (error) {
      console.log(error);
      throw new UserDomainException('Error updating user');
    }
  }
}
