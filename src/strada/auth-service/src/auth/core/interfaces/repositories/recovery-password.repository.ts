import { RecoverPassword } from '../../entities/recover-password.entity';

export interface IRecoveryPasswordRepository {
  create(recoveryPassword: RecoverPassword): Promise<RecoverPassword>;
  revoke(id: string): Promise<RecoverPassword>;
  findOne(token: string, email: string): Promise<RecoverPassword>;
}
