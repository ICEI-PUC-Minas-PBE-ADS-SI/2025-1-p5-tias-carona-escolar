import { AuthResourceNotFoundException } from '@/src/auth/core/exceptions/resource-not-found.exception';
import { IEmailService } from '@/src/auth/core/interfaces/recover-password/email-service.interface';
import { IRecoveryPasswordRepository } from '@/src/auth/core/interfaces/repositories/recovery-password.repository';
import { CreateRecoverPasswordTokenUseCase } from '@/src/auth/core/use-cases/create-recover-password-token.use-case';
import { FindUserByEmailUseCase } from '@/src/user/core/use-cases/find-user-by-email.use-case';
import { User } from '@prisma/client';

describe('CreateRecoverPasswordTokenUseCase', () => {
  let createRecoverPasswordTokenUseCase: CreateRecoverPasswordTokenUseCase;
  let recoveryPasswordRepositoryMock: jest.Mocked<IRecoveryPasswordRepository>;
  let findUserByEmailUseCaseMock: jest.Mocked<FindUserByEmailUseCase>;
  let emailServiceMock: jest.Mocked<IEmailService>;

  beforeEach(() => {
    recoveryPasswordRepositoryMock = {
      create: jest.fn().mockResolvedValue({ token: 'mockToken' }),
    } as unknown as jest.Mocked<IRecoveryPasswordRepository>;
    findUserByEmailUseCaseMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<FindUserByEmailUseCase>;
    emailServiceMock = { send: jest.fn().mockResolvedValue(undefined) };

    createRecoverPasswordTokenUseCase = new CreateRecoverPasswordTokenUseCase(
      recoveryPasswordRepositoryMock,
      findUserByEmailUseCaseMock,
      emailServiceMock,
    );
  });

  it('Should create a password recover token and send an e-mail', async () => {
    const mockUser = {
      id: '1',
      email: 'user@example.com',
      password: 'mockedPass',
    } as User;

    findUserByEmailUseCaseMock.execute.mockResolvedValue(mockUser);

    const email = { email: 'user@example.com' };
    await createRecoverPasswordTokenUseCase.execute({ email });

    expect(findUserByEmailUseCaseMock.execute).toHaveBeenCalledWith(
      mockUser.email,
    );

    expect(recoveryPasswordRepositoryMock.create).toHaveBeenCalled();

    expect(emailServiceMock.send).toHaveBeenCalledWith({
      to: 'user@example.com',
      subject: 'Instruções para redefinição de senha',
      body: expect.any(String),
    });
  });

  it('Should throw resource not found exception if user was not found', async () => {
    findUserByEmailUseCaseMock.execute.mockRejectedValue(
      new AuthResourceNotFoundException('User not found'),
    );

    const email = 'nonexistent@example.com';

    try {
      await createRecoverPasswordTokenUseCase.execute({ email });
    } catch (error) {
      expect(error).toEqual(
        new AuthResourceNotFoundException('User not found'),
      );
    }
  });

  it('Should generate a valid token', async () => {
    const email = { email: 'user@example.com' };
    const mockUser = { id: '1', email: 'user@example.com' } as User;

    findUserByEmailUseCaseMock.execute.mockResolvedValue(mockUser);

    await createRecoverPasswordTokenUseCase.execute(email);

    expect(recoveryPasswordRepositoryMock.create).toHaveBeenCalled();
  });
});
