export class AuthResourceNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = AuthResourceNotFoundException.name;
  }
}
