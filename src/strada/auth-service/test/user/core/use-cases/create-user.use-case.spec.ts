import { IPasswordEncoder } from '@/src/auth/core/interfaces/utils/password-encoder.interface';
import { UserDuplicateresourceException } from '@/src/user/core/exceptions/duplicate-resource.exception';
import { IUserRepository } from '@/src/user/core/interfaces/repositories/user-repository.interface';
import { CreateUserUseCase } from '@/src/user/core/use-cases/create-user.use-case';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let passwordEncoder: jest.Mocked<IPasswordEncoder>;

  beforeEach(() => {
    passwordEncoder = {
      encode: jest.fn(),
    } as unknown as jest.Mocked<IPasswordEncoder>;

    userRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    createUserUseCase = new CreateUserUseCase(userRepository, passwordEncoder);
  });

  it('Should create a user', async () => {
    const dto = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      username: 'john_doe',
      password: '123456',
    };

    passwordEncoder.encode.mockResolvedValue('hashedPassword');

    userRepository.create.mockResolvedValue({
      id: 'user-id',
      name: 'John Doe',
      email: 'johndoe@example.com',
      imgUrl: null,
      numberOfRecipes: 0,
      numberOfFollowers: 0,
      numberOfFollowings: 0,
      username: 'john_doe',
      createdAt: new Date(),
      isActive: true,
    });

    const result = await createUserUseCase.execute(dto);

    expect(result.name).toEqual(dto.name);
    expect(result.email).toEqual(dto.email);
    expect(result.username).toEqual(dto.username);
  });

  it('Should throw an error when email already exists', async () => {
    const dto = {
      name: 'John Doe',
      email: 'existingemail@gmail.com',
      username: 'john_doe',
      password: '123456',
    };

    userRepository.findByEmail.mockResolvedValue({
      id: 'existing-id',
      name: 'Existing User',
      email: 'existingemail@gmail.com',
      imgUrl: null,
      numberOfRecipes: 0,
      numberOfFollowers: 0,
      numberOfFollowings: 0,
      username: 'john_doe',
      createdAt: new Date(),
      isActive: true,
    });

    const result = createUserUseCase.execute(dto);

    await expect(result).rejects.toThrow(UserDuplicateresourceException);
  });

  it('Should throw an error when username already exists', async () => {
    const dto = {
      name: 'John Doe',
      email: 'existingemail@gmail.com',
      username: 'existing_username',
      password: '123456',
    };

    userRepository.findByEmail.mockResolvedValue({
      id: 'existing-id',
      name: 'Existing User',
      email: 'existingemail@gmail.com',
      imgUrl: null,
      numberOfRecipes: 0,
      numberOfFollowers: 0,
      numberOfFollowings: 0,
      username: 'existing_username',
      createdAt: new Date(),
      isActive: true,
    });

    const result = createUserUseCase.execute(dto);

    await expect(result).rejects.toThrow(UserDuplicateresourceException);
  });
});
