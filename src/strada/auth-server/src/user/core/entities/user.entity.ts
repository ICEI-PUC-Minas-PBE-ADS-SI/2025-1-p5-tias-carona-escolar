import { UserInvalidFieldValueException } from '../exceptions/invalid-field-value.exception';

export class User {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  imgUrl: string;
  authProvider: string;
  numberOfRecipes: number;
  numberOfFollowers: number;
  numberOfFollowings: number;
  createdAt: Date;
  isActive: boolean = true;
  followers: User[];
  followings: User[];

  constructor(partial: Partial<User>) {
    this.id = partial.id ?? crypto.randomUUID();
    this.authProvider = partial.authProvider ?? 'local';
    Object.assign(this, partial);

    this.validate();
  }

  private validate(): void {
    const errorMessages: Record<string, string>[] = [];

    if (!this.name || this.name.length < 3) {
      errorMessages.push({ nome: 'Nome deve conter ao menos 3 letras' });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (this.email && !emailRegex.test(this.email)) {
      errorMessages.push({ email: 'Formato de email inválido' });
    }

    if (!this.username || this.username.length < 3) {
      errorMessages.push({
        username: 'Username deve conter ao menos 3 letras',
      });
    }

    if (
      this.authProvider === 'local' &&
      (!this.password || this.password.length < 6)
    ) {
      errorMessages.push({
        password: 'Senha deve conter no minimo 6 caracters',
      });
    }

    if (errorMessages.length > 0) {
      throw new UserInvalidFieldValueException(errorMessages);
    }
  }
}
