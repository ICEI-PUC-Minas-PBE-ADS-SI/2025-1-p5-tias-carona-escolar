import { FindUserByEmailUseCase } from '@/src/user/core/use-cases/find-user-by-email.use-case';
import { IRecoverPasswordRequest } from '../interfaces/recover-password/recover-password-request.interface';
import { IRecoveryPasswordRepository } from '../interfaces/repositories/recovery-password.repository';
import { RecoverPassword } from '../entities/recover-password.entity';
import { AuthUnauthorizedException } from '../exceptions/unauthorized.exceptions';
import { UpdateUserPasswordUseCase } from '@/src/user/core/use-cases/update-user-password.use-case';

export class UpdatePasswordUseCase {
  constructor(
    private readonly recoverPasswordRepository: IRecoveryPasswordRepository,
    private readonly findByEmailUseCase: FindUserByEmailUseCase,
    private readonly updateUserPasswordUseCase: UpdateUserPasswordUseCase,
  ) {}

  async execute(dto: IRecoverPasswordRequest): Promise<void> {
    const recoverToken = await this.getRecoverToken(dto.token, dto.email);
    this.validateRecoverToken(recoverToken);

    const existingUser = await this.findByEmailUseCase.execute(dto.email);

    this.updateUserPasswordUseCase.execute({
      userId: existingUser.id,
      password: dto.password,
    });

    this.recoverPasswordRepository.revoke(recoverToken.id);
  }

  private async getRecoverToken(token, email): Promise<RecoverPassword> {
    const recoverToken = await this.recoverPasswordRepository.findOne(
      token,
      email,
    );
    if (!recoverToken) {
      throw new AuthUnauthorizedException('Invalid Reccover token');
    }

    return recoverToken;
  }

  private validateRecoverToken(recoveryToken: RecoverPassword) {
    if (recoveryToken.revoked) {
      throw new AuthUnauthorizedException('Recover token revoked');
    }
    const isExpired =
      BigInt(recoveryToken.expiresAt) < BigInt(new Date().getTime());
    if (isExpired) {
      throw new AuthUnauthorizedException('Recover token expired');
    }
  }
}
