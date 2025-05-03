import { RecoverPassword } from '@/src/auth/core/entities/recover-password.entity';
import { IRecoveryPasswordRepository } from '@/src/auth/core/interfaces/repositories/recovery-password.repository';
import { UpdatePasswordUseCase } from '@/src/auth/core/use-cases/update-password.use-case';
import { FindUserByEmailUseCase } from '@/src/user/core/use-cases/find-user-by-email.use-case';
import { UpdateUserPasswordUseCase } from '@/src/user/core/use-cases/update-user-password.use-case';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';

describe('UpdatePasswordUseCase', () => {
  let useCase: UpdatePasswordUseCase;
  let recoverPasswordRepository: jest.Mocked<IRecoveryPasswordRepository>;
  let updateUserPasswordUseCase: jest.Mocked<UpdateUserPasswordUseCase>;
  let findUserByEmailUseCase: jest.Mocked<FindUserByEmailUseCase>;

  beforeEach(() => {
    recoverPasswordRepository = {
      findOne: jest.fn(),
      revoke: jest.fn(),
    } as unknown as jest.Mocked<IRecoveryPasswordRepository>;
    updateUserPasswordUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UpdateUserPasswordUseCase>;
    findUserByEmailUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<FindUserByEmailUseCase>;

    useCase = new UpdatePasswordUseCase(
      recoverPasswordRepository,
      findUserByEmailUseCase,
      updateUserPasswordUseCase,
    );
  });

  it('should update password if token is valid', async () => {
    recoverPasswordRepository.findOne.mockResolvedValue({
      id: 'recoverId',
      revoked: false,
      expiresAt: BigInt(Date.now() + 10000),
      email: 'email@example.com',
      token: 'validToken',
      userId: 'userId',
    });

    findUserByEmailUseCase.execute.mockResolvedValue({
      id: 'userId',
      name: 'John Doe',
      email: 'example@email.com',
      username: 'john_doe',
      password: 'oldPassword',
    } as User);

    await useCase.execute({
      email: 'email@example.com',
      userId: 'userId',
      password: 'newPassword',
      token: 'validToken',
    });

    expect(updateUserPasswordUseCase.execute).toHaveBeenCalledWith({
      userId: 'userId',
      password: 'newPassword',
    });
  });

  it('should throw UnauthorizedException if the token is revoked', async () => {
    recoverPasswordRepository.findOne.mockResolvedValue({
      revoked: true,
    } as RecoverPassword);

    await expect(
      useCase.execute({
        email: 'email@example.com',
        password: 'newPassword',
        token: 'validToken',
      }),
    ).rejects.toThrow(new UnauthorizedException('Recover token revoked'));
  });
});
