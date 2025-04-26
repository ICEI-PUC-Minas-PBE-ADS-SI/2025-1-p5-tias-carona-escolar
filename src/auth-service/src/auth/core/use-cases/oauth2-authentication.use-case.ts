import { IAccessToken } from '../interfaces/access-token/acces-token.interface';
import { CreateUserUseCase } from '@/src/user/core/use-cases/create-user.use-case';
import { CreateAccessTokenUseCase } from './create-access-token.use-case';
import { IUserRequest } from '@/src/user/core/interfaces/user/user-request.interface';
import { AuthUnauthorizedException } from '../exceptions/unauthorized.exceptions';
import { UserDuplicateresourceException } from '@/src/user/core/exceptions/duplicate-resource.exception';

export class OAuth2AuthenticationUseCase {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly createAccessTokenUseCase: CreateAccessTokenUseCase,
  ) {}

  async execute(dto: IUserRequest): Promise<IAccessToken> {
    try {
      await this.createUserUseCase.execute(dto);
      return this.generateAccesToken(dto.email);
    } catch (error) {
      console.error(error);
      if (error instanceof UserDuplicateresourceException) {
        try {
          return await this.generateAccesToken(dto.email);
        } catch (error) {
          console.log(error);
          throw new AuthUnauthorizedException('Error generating access token');
        }
      }
      throw new AuthUnauthorizedException('Error generating access token');
    }
  }

  private async generateAccesToken(email: string): Promise<IAccessToken> {
    return this.createAccessTokenUseCase.execute({
      email,
      password: undefined,
    });
  }
}
