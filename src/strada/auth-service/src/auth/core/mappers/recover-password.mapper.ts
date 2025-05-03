import { RecoverPassword } from '../entities/recover-password.entity';
import { IRecoverPasswordRequest } from '../interfaces/recover-password/recover-password-request.interface';

export class RecoverPasswordMapper {
  static toEntity(dto: IRecoverPasswordRequest): RecoverPassword {
    return new RecoverPassword({
      email: dto.email,
      token: dto.token,
      userId: dto.userId,
    });
  }
}
