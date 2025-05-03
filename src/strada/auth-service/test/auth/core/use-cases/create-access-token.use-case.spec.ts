import { CreateAccessTokenUseCase } from '@/src/auth/core/use-cases/create-access-token.use-case';
import { FindUserByEmailUseCase } from '@/src/user/core/use-cases/find-user-by-email.use-case';
import { IJwtService } from 'src/auth/core/interfaces/jwt/jwt.service.interface';
import { CreateRefreshTokenUseCase } from '@/src/auth/core/use-cases/create-refresh-token.use-case';
import { IPasswordEncoder } from '@/src/auth/core/interfaces/utils/password-encoder.interface';
import { ICreadentials } from '@/src/auth/core/interfaces/access-token/credentials.interface';
import { jwtConstants } from '@/src/auth/core/contants/jwt-contants';
import { User } from '@/src/user/core/entities/user.entity';
import { AuthUnauthorizedException } from '@/src/auth/core/exceptions/unauthorized.exceptions';

describe('CreateAccessTokenUseCase', () => {
  let createAccessTokenUseCase: CreateAccessTokenUseCase;
  let findUserByEmail: jest.Mocked<FindUserByEmailUseCase>;
  let jwtService: jest.Mocked<IJwtService>;
  let passwordEncoder: jest.Mocked<IPasswordEncoder>;
  let createRefreshTokenUseCase: jest.Mocked<CreateRefreshTokenUseCase>;

  beforeEach(() => {
    findUserByEmail = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<FindUserByEmailUseCase>;

    jwtService = {
      sign: jest.fn(),
    } as unknown as jest.Mocked<IJwtService>;

    passwordEncoder = {
      compare: jest.fn(),
    } as unknown as jest.Mocked<IPasswordEncoder>;

    createRefreshTokenUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateRefreshTokenUseCase>;

    createAccessTokenUseCase = new CreateAccessTokenUseCase(
      findUserByEmail,
      jwtService,
      passwordEncoder,
      createRefreshTokenUseCase,
    );
  });

  it('should successfully generate access token and refresh token', async () => {
    const credentials: ICreadentials = {
      email: 'user@example.com',
      password: 'validPassword',
    };

    const user = {
      id: 'userId',
      email: 'user@example.com',
      password: 'hashedPassword',
    } as User;

    findUserByEmail.execute.mockResolvedValue(user);
    passwordEncoder.compare.mockResolvedValue(true);
    jwtService.sign.mockReturnValue('accessToken');

    createRefreshTokenUseCase.execute.mockResolvedValue({
      refresh_token: 'refreshToken',
    });

    const result = await createAccessTokenUseCase.execute(credentials);

    expect(result.access_token).toBe('accessToken');
    expect(result.refresh_token).toBe('refreshToken');
    expect(result.token_type).toBe('Bearer');
    expect(result.expires_in).toBe(jwtConstants.expiresIn);
  });

  it('should throw an error if jwtService fails to generate access token', async () => {
    const credentials: ICreadentials = {
      email: 'user@example.com',
      password: 'validPassword',
    };

    const user = {
      id: 'userId',
      email: 'user@example.com',
      password: 'hashedPassword',
    } as User;
    findUserByEmail.execute.mockResolvedValue(user);
    passwordEncoder.compare.mockResolvedValue(true);
    jwtService.sign.mockImplementation(() => {
      throw new Error('JWT Error');
    });
    await expect(createAccessTokenUseCase.execute(credentials)).rejects.toThrow(
      AuthUnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    const credentials: ICreadentials = {
      email: 'user@example.com',
      password: 'invalidPassword',
    };

    const user = {
      id: 'userId',
      email: 'user@example.com',
      password: 'hashedPassword',
    } as User;

    findUserByEmail.execute.mockResolvedValue(user);
    passwordEncoder.compare.mockResolvedValue(false);

    await expect(createAccessTokenUseCase.execute(credentials)).rejects.toThrow(
      AuthUnauthorizedException,
    );
  });

  it('should generate access token and refresh token without password validation when withPassword is false', async () => {
    const credentials: ICreadentials = {
      email: 'user@example.com',
      password: 'anyPassword',
    };

    const user = {
      id: 'userId',
      email: 'user@example.com',
      password: 'hashedPassword',
    } as User;

    findUserByEmail.execute.mockResolvedValue(user);
    passwordEncoder.compare.mockResolvedValue(true);
    jwtService.sign.mockReturnValue('accessToken');
    createRefreshTokenUseCase.execute.mockResolvedValue({
      refresh_token: 'refreshToken',
    });

    const result = await createAccessTokenUseCase.execute(credentials);

    expect(result.access_token).toBe('accessToken');
    expect(result.refresh_token).toBe('refreshToken');
    expect(result.token_type).toBe('Bearer');
    expect(result.expires_in).toBe(jwtConstants.expiresIn);
  });

  it('should throw ResourceNotFoundException when email no exists', async () => {
    const credentials: ICreadentials = {
      email: 'user@example.com',
      password: 'validPassword',
    };

    findUserByEmail.execute.mockRejectedValue(
      new AuthUnauthorizedException('User not found '),
    );

    await expect(createAccessTokenUseCase.execute(credentials)).rejects.toThrow(
      AuthUnauthorizedException,
    );
  });
});
