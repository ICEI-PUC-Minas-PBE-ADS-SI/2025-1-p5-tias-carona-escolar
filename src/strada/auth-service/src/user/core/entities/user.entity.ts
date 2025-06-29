import { UserInvalidFieldValueException } from '../exceptions/invalid-field-value.exception';
import { UserType } from '@prisma/client';

export class User {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  imgUrl: string;
  authProvider: string;
  createdAt: Date;
  isActive: boolean = true;

  // Novos campos de documentos e informações pessoais (opcionais)
  cpf?: string;
  rg?: string;
  cnh?: string;

  vehicle_model?: string;
  vehicle_color?: string;
  license_plate?: string;

  birthDate?: Date;
  phone?: string;
  address?: string;
  cep?: string;
  city?: string;
  state?: string;
  userType: UserType;

  constructor(partial: Partial<User>) {
    this.id = partial.id ?? crypto.randomUUID();
    this.authProvider = partial.authProvider ?? 'local';
    this.userType = partial.userType ?? UserType.ADULT;
    Object.assign(this, partial);
    this.validate();
  }

  private validate(): void {
    const errorMessages: Record<string, string>[] = [];

    // Validação do nome
    if (!this.name || this.name.length < 3) {
      errorMessages.push({ nome: 'Nome deve conter ao menos 3 letras' });
    }

    // Validação do email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (this.email && !emailRegex.test(this.email)) {
      errorMessages.push({ email: 'Formato de email inválido' });
    }

    // Validação do username
    if (!this.username || this.username.length < 3) {
      errorMessages.push({
        username: 'Username deve conter ao menos 3 letras',
      });
    }

    // Validação da senha (apenas para autenticação local)
    if (
      this.authProvider === 'local' &&
      (!this.password || this.password.length < 6)
    ) {
      errorMessages.push({
        password: 'Senha deve conter no minimo 6 caracters',
      });
    }

    // Validação do CPF (se fornecido)
    if (this.cpf && !this.isValidCPF(this.cpf)) {
      errorMessages.push({
        cpf: 'CPF inválido',
      });
    }

    // Validação da data de nascimento
    if (this.birthDate) {
      const today = new Date();
      const birthDate = new Date(this.birthDate);

      if (birthDate > today) {
        errorMessages.push({
          birthDate: 'Data de nascimento não pode ser no futuro',
        });
      }

      // Validação específica para menores de idade
      if (this.userType === UserType.MINOR) {
        const age = this.calculateAge(birthDate);
        if (age >= 18) {
          errorMessages.push({
            userType: 'Usuário cadastrado como menor deve ter menos de 18 anos',
          });
        }
      }
    }

    // Validação do CEP (se fornecido)
    if (this.cep && !this.isValidCEP(this.cep)) {
      errorMessages.push({
        cep: 'CEP deve ter o formato 00000-000 ou 00000000',
      });
    }

    // Validação do telefone (se fornecido)
    if (this.phone && !this.isValidPhone(this.phone)) {
      errorMessages.push({
        phone: 'Telefone deve ter formato válido (xx) xxxxx-xxxx',
      });
    }

    if (errorMessages.length > 0) {
      throw new UserInvalidFieldValueException(errorMessages);
    }
  }

  private isValidCPF(cpf: string): boolean {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');

    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;

    return true;
  }

  private isValidCEP(cep: string): boolean {
    // Remove caracteres não numéricos
    const cleanCEP = cep.replace(/[^\d]/g, '');
    return cleanCEP.length === 8;
  }

  private isValidPhone(phone: string): boolean {
    // Remove caracteres não numéricos
    const cleanPhone = phone.replace(/[^\d]/g, '');
    // Aceita telefones com 10 ou 11 dígitos (com ou sem celular)
    return cleanPhone.length === 10 || cleanPhone.length === 11;
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }

  // Métodos utilitários
  public getAge(): number | null {
    if (!this.birthDate) return null;
    return this.calculateAge(new Date(this.birthDate));
  }

  public isMinor(): boolean {
    return this.userType === UserType.MINOR;
  }

  public isAdult(): boolean {
    return this.userType === UserType.ADULT;
  }

  public getFormattedCPF(): string | null {
    if (!this.cpf) return null;
    const cleanCPF = this.cpf.replace(/[^\d]/g, '');
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  public getFormattedPhone(): string | null {
    if (!this.phone) return null;
    const cleanPhone = this.phone.replace(/[^\d]/g, '');

    if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    return this.phone;
  }

  public getFormattedCEP(): string | null {
    if (!this.cep) return null;
    const cleanCEP = this.cep.replace(/[^\d]/g, '');
    return cleanCEP.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
}
