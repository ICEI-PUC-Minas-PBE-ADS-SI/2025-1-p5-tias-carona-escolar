import { IUserRepository } from '../interfaces/repositories/user-repository.interface';
import { IFollow } from '../interfaces/user/follow-interface';
import { FindUserByIdlUserUseCase } from './find-user-by-id.use-case';
import { UserDomainException } from '../exceptions/domain.exception';
import { UpdateUserUseCase } from './update-user.use-case';

export class UnfollowUserByIdUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly findUserByIdUserCase: FindUserByIdlUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  async execute(dto: IFollow): Promise<void> {
    this.validate(dto);
    await this.updateFollowers(dto);
    try {
      await this.userRepository.removeFollow(dto);
    } catch (error) {
      console.log(error);
      throw new UserDomainException(
        `Erro trying follow user ${dto.followeeId}`,
      );
    }
  }

  private async updateFollowers(dto: IFollow): Promise<void> {
    const followerUser = await this.findUserByIdUserCase.execute(
      dto.followerId,
    );
    const followeeUser = await this.findUserByIdUserCase.execute(
      dto.followeeId,
    );
    followerUser.numberOfFollowers -= 1;
    followeeUser.numberOfFollowings -= 1;
    await this.updateUserUseCase.execute(followerUser.id, followerUser);
    await this.updateUserUseCase.execute(followeeUser.id, followeeUser);
  }

  validate(dto: IFollow) {
    if (!dto.followeeId || !dto.followerId) {
      throw new UserDomainException('Ids de usuário deve ser informado');
    }
    if (dto.followeeId === dto.followerId) {
      throw new UserDomainException('Não é possível seguir a si mesmo');
    }
  }
}
