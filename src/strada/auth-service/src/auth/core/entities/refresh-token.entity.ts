export class RefreshToken {
  id: string;
  token: string;
  userId: string;
  email: string;
  revoked: boolean = false;

  constructor(partial: Partial<RefreshToken>) {
    this.id = partial.id ?? crypto.randomUUID();
    Object.assign(this, partial);
  }
}
