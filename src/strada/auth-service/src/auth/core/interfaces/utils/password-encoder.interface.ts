export interface IPasswordEncoder {
  encode(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}
