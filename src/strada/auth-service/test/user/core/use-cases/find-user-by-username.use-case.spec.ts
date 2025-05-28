import { UserResourceNotFoundException } from '@/src/user/core/exceptions/resource-not-found.exception';
import { IUserRepository } from '@/src/user/core/interfaces/repositories/user-repository.interface';
import { FindUserByUsernameUseCase } from '@/src/user/core/use-cases/find-user-by-username.use-case';

describe('FindUserByUsernameUseCase', () => {
  let findUserByUsernamelUseCase: FindUserByUsernameUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      findByUsername: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    findUserByUsernamelUseCase = new FindUserByUsernameUseCase(userRepository);
  });

  it('Should return a user when username exists', async () => {
    const user = {
      id: 'user-id',
      name: 'John Doe',
      email: 'existingemail@gmail.com',
      imgUrl: null,
      numberOfRecipes: 0,
      numberOfFollowers: 0,
      numberOfFollowings: 0,
      username: 'existing_username',
      createdAt: new Date(),
      isActive: true,
    };

    userRepository.findByUsername.mockResolvedValue(user);

    const result =
      await findUserByUsernamelUseCase.execute('existing_username');

    expect(result).toMatchObject(user);
    expect(result.email).toEqual(user.email);
    expect(result.username).toEqual(user.username);
    expect(result.name).toEqual(user.name);
  });

  it('Should throw an error when username does not exist', async () => {
    userRepository.findByUsername.mockResolvedValue(null);

    await expect(
      findUserByUsernamelUseCase.execute('nonexisting_username'),
    ).rejects.toThrow(
      new UserResourceNotFoundException('User not found: nonexisting_username'),
    );
  });
});
