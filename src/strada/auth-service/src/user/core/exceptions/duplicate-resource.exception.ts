export class UserDuplicateresourceException extends Error {
  constructor(message: string) {
    super(message);
    this.name = UserDuplicateresourceException.name;
  }
}
