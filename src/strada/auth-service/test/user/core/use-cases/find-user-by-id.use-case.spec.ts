import { UserResourceNotFoundException } from '@/src/user/core/exceptions/resource-not-found.exception';
import { IUserRepository } from '@/src/user/core/interfaces/repositories/user-repository.interface';
import { FindUserByIdlUserUseCase } from '@/src/user/core/use-cases/find-user-by-id.use-case';

describe('FindUserByUsernameUseCase', () => {
  let findUserByIdUseCase: FindUserByIdlUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    findUserByIdUseCase = new FindUserByIdlUserUseCase(userRepository);
  });

  it('Should return a user when username exists', async () => {
    const user = {
      id: 'existing_id',
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

    userRepository.findById.mockResolvedValue(user);

    const result = await findUserByIdUseCase.execute('existing_id');

    expect(result).toMatchObject(user);
    expect(result.email).toEqual(user.email);
    expect(result.username).toEqual(user.username);
    expect(result.name).toEqual(user.name);
  });

  it('Should throw an error when id not exists', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(findUserByIdUseCase.execute('nonexisting_id')).rejects.toThrow(
      UserResourceNotFoundException,
    );
  });
});
