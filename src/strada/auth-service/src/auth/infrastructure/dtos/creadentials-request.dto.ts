import { ICreadentials } from 'src/auth/core/interfaces/access-token/credentials.interface';

export class CredentiaslRequestDto implements ICreadentials {
  email: string;
  password: string;

  constructor(partial: Partial<CredentiaslRequestDto>) {
    Object.assign(this, partial);
  }
}
