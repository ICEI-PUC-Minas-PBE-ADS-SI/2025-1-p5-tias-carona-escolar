import { UserResourceNotFoundException } from '@/src/user/core/exceptions/resource-not-found.exception';
import { IUserRepository } from '@/src/user/core/interfaces/repositories/user-repository.interface';
import { FindUserByEmailUseCase } from '@/src/user/core/use-cases/find-user-by-email.use-case';

describe('FindUserByEmalUseCase', () => {
  let findUserByEmailUseCase: FindUserByEmailUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    findUserByEmailUseCase = new FindUserByEmailUseCase(userRepository);
  });

  it('Should return a user when email exists', async () => {
    const user = {
      id: 'user-id',
      name: 'John Doe',
      email: 'existingemail@gmail.com',
      imgUrl: null,
      numberOfRecipes: 0,
      numberOfFollowers: 0,
      numberOfFollowings: 0,
      username: 'john_doe',
      createdAt: new Date(),
      isActive: true,
    };

    userRepository.findByEmail.mockResolvedValue(user);

    const result = await findUserByEmailUseCase.execute(
      'existingemail@gmail.com',
    );

    expect(result).toMatchObject(user);
    expect(result.email).toEqual(user.email);
    expect(result.username).toEqual(user.username);
    expect(result.name).toEqual(user.name);
  });

  it('Should throw an error when email not exists', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      findUserByEmailUseCase.execute('nonexistingemail@gmail.com'),
    ).rejects.toThrow(UserResourceNotFoundException);
  });
});
