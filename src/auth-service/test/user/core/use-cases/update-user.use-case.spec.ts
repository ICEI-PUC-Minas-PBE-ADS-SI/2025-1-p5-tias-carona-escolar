import { IUserRepository } from '@/src/user/core/interfaces/repositories/user-repository.interface';
import { FindUserByIdlUserUseCase } from '@/src/user/core/use-cases/find-user-by-id.use-case';
import { UpdateUserUseCase } from '@/src/user/core/use-cases/update-user.use-case';

describe('UpdateUserUseCase', () => {
  let updateUserUseCase: UpdateUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let findUserByIdUseCase: jest.Mocked<FindUserByIdlUserUseCase>;

  beforeEach(() => {
    userRepository = {
      update: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    findUserByIdUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<FindUserByIdlUserUseCase>;

    updateUserUseCase = new UpdateUserUseCase(
      userRepository,
      findUserByIdUseCase,
    );
  });

  it('should update the user successfully when valid id and data are provided', async () => {
    const id = 'valid-id';
    const dto = {
      name: 'new name',
      username: 'newUsername',
      email: 'newEmail@example.com',
    };

    const oldUser = {
      id: 'valid-old-id',
      name: 'old Name',
      email: 'oldEmail@gmail.com',
      imgUrl: null,
      password: 'oldHashesdPassword',
      numberOfRecipes: 0,
      numberOfFollowers: 0,
      numberOfFollowings: 0,
      username: 'oldUsername',
      createdAt: new Date(),
      isActive: true,
    };

    const updatedUser = {
      ...dto,
      id: 'valid-id',
      name: 'new Name',
      email: 'newemail@gmail.com',
      imgUrl: null,
      numberOfRecipes: 0,
      numberOfFollowers: 0,
      numberOfFollowings: 0,
      username: 'newUsername',
      createdAt: new Date(),
      isActive: true,
    };

    findUserByIdUseCase.execute.mockResolvedValue(oldUser);

    userRepository.update.mockResolvedValue(updatedUser);

    const result = await updateUserUseCase.execute(id, dto);

    expect(findUserByIdUseCase.execute).toHaveBeenCalledWith(id);
    expect(userRepository.update).toHaveBeenCalledWith(id, {
      authProvider: 'local',
      email: 'newEmail@example.com',
      imgUrl: undefined,
      isActive: true,
      name: 'new name',
      username: 'newUsername',
    });
    expect(result).toEqual(updatedUser);
  });

  it('should throw an error when user not found', async () => {
    const id = 'nonexistent-id';
    const dto = {
      name: 'new name',
      username: 'newUsername',
      email: 'newEmail@example.com',
    };

    findUserByIdUseCase.execute.mockRejectedValue(new Error('User not found'));

    await expect(updateUserUseCase.execute(id, dto)).rejects.toThrow(
      'User not found',
    );
  });
});
