export interface IRecoverPasswordRequest {
  token: string;
  userId?: string;
  email: string;
  password?: string;
}
