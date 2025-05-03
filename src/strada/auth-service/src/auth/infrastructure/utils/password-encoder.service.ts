import * as bcrypt from 'bcryptjs';
import { IPasswordEncoder } from 'src/auth/core/interfaces/utils/password-encoder.interface';

export class PasswordEncoder implements IPasswordEncoder {
  public async encode(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
