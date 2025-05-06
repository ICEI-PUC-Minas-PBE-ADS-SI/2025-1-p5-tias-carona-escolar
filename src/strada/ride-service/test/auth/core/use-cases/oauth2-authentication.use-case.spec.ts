import { AuthUnauthorizedException } from '@/src/auth/core/exceptions/unauthorized.exceptions';
import { CreateAccessTokenUseCase } from '@/src/auth/core/use-cases/create-access-token.use-case';
import { OAuth2AuthenticationUseCase } from '@/src/auth/core/use-cases/oauth2-authentication.use-case';
import { CreateUserUseCase } from '@/src/user/core/use-cases/create-user.use-case';

describe('OAuth2AuthenticationUseCase', () => {
  let useCase: OAuth2AuthenticationUseCase;
  let createUserUseCase: jest.Mocked<CreateUserUseCase>;
  let createAccessTokenUseCase: jest.Mocked<CreateAccessTokenUseCase>;

  beforeEach(() => {
    createUserUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateUserUseCase>;
    createAccessTokenUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateAccessTokenUseCase>;
    useCase = new OAuth2AuthenticationUseCase(
      createUserUseCase,
      createAccessTokenUseCase,
    );
  });

  it('should throw AuthUnauthorizedException when an error occurs in createUserUseCase and error is not a instance of UserDuplicatedExcetion', async () => {
    createUserUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('User creation failed'));

    const dto = {
      name: 'user',
      username: 'username',
      email: 'test@example.com',
      password: 'password123',
    };

    await expect(useCase.execute(dto)).rejects.toThrow(
      new AuthUnauthorizedException('Error generating access token'),
    );
  });

  it('should throw AuthUnauthorizedException when an error occurs in CreateAccessTokenUseCase', async () => {
    const dto = {
      name: 'user',
      username: 'username',
      email: 'test@example.com',
      password: 'password123',
    };

    createUserUseCase.execute.mockResolvedValue({
      ...dto,
      id: 'existing-id',
      imgUrl: null,
      numberOfRecipes: 0,
      numberOfFollowers: 0,
      numberOfFollowings: 0,
      createdAt: new Date(),
      isActive: true,
    });

    createAccessTokenUseCase.execute = jest
      .fn()
      .mockRejectedValue(
        new AuthUnauthorizedException('Error generating access token'),
      );

    await expect(useCase.execute(dto)).rejects.toThrow(
      new AuthUnauthorizedException('Error generating access token'),
    );
  });
});
