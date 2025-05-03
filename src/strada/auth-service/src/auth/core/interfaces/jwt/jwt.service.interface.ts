export interface IJwtService {
  sign(payload: any): string;
  verify(token: string): any;
  decode(token: string): any;
  getJwks(): any;
}
