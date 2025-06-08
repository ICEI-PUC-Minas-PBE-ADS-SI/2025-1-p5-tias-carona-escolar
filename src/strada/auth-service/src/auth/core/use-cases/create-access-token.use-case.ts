import { FindUserByEmailUseCase } from '@/src/user/core/use-cases/find-user-by-email.use-case';
import { IJwtService } from '../interfaces/jwt/jwt.service.interface';
import { CreateRefreshTokenUseCase } from './create-refresh-token.use-case';
import { ICreadentials } from '../interfaces/access-token/credentials.interface';
import { IPasswordEncoder } from '@/src/user/core/interfaces/utils/password-encoder.interface';
import { AuthUnauthorizedException } from '../exceptions/unauthorized.exceptions';
import { jwtConstants } from '../contants/jwt-contants';
import { IAccessToken } from '../interfaces/access-token/acces-token.interface';

export class CreateAccessTokenUseCase {
  constructor(
    private readonly findUserByEmail: FindUserByEmailUseCase,
    private readonly jwtService: IJwtService,
    private readonly passwordEncoder: IPasswordEncoder,
    private readonly createRefreshTokenUseCase: CreateRefreshTokenUseCase,
  ) {}

  async execute(credentials: ICreadentials): Promise<IAccessToken> {
    const { email, username, password, authProvider } = credentials;

    try {
      const user = await this.findUserByEmail.execute(email ?? username);

      if (user.authProvider === 'local' && authProvider !== 'refreshToken') {
        console.log('Local user');
        console.log(user);
        console.log(credentials);
        await this.validatePassword(password, user.password);
      }

      const access_token = await this.getAccessToken(user.id, user.email);
      const refresh_token = await this.getRefreshToken(user.id, user.email);
      const expires_in = jwtConstants.expiresIn;

      return { access_token, token_type: 'Bearer', expires_in, refresh_token };
    } catch (error) {
      console.error(error);
      throw new AuthUnauthorizedException('Invalid credentials');
    }
  }

  private async getAccessToken(userId: string, email: string) {
    try {
      const payload = { sub: userId, email: email };
      const access_token = this.jwtService.sign(payload);
      return access_token;
    } catch {
      throw new AuthUnauthorizedException('Error generating access token');
    }
  }

  private async getRefreshToken(userId: string, email: string) {
    const { refresh_token } = await this.createRefreshTokenUseCase.execute({
      userId,
      email,
    });
    return refresh_token;
  }

  private async validatePassword(password: string, hashedPassword: string) {
    const passwordMatch = await this.passwordEncoder.compare(
      password,
      hashedPassword,
    );
    if (!passwordMatch) {
      throw new AuthUnauthorizedException('Invalid credentials');
    }
  }
}
