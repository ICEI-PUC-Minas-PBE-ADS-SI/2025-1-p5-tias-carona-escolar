export class AuthDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = AuthDomainException.name;
  }
}
