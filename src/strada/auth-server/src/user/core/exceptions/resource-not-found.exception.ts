export class UserResourceNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = UserResourceNotFoundException.name;
  }
}
