import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateAccessTokenUseCase } from '@/src/auth/core/use-cases/create-access-token.use-case';
import { RefreshTokenUseCase } from '@/src/auth/core/use-cases/refresh-token.use-case';
import { CredentiaslRequestDto } from '../dtos/creadentials-request.dto';
import { AccessTokenResponseDto } from '../dtos/access-token-response.dto';
import { RefreshTokenRequestDto } from '../dtos/refresh-token-request.dto';
import { CreateRecoverPasswordTokenUseCase } from '@/src/auth/core/use-cases/create-recover-password-token.use-case';
import { RecoverPassordRequestDto } from '../dtos/recover-password-request.dto';
import { UpdatePasswordUseCase } from '@/src/auth/core/use-cases/update-password.use-case';
import { AuthGuard } from '@nestjs/passport';
import { OAuth2AuthenticationUseCase } from '@/src/auth/core/use-cases/oauth2-authentication.use-case';
import { PassportGoogleStrategy } from '../utils/oauth2-google-provider.impl';
import { PassportGithubStrategy } from '../utils/oauth2-github-provider.impl';
import { Public } from '../utils/auth.public';
import { IJwtService } from '../../core/interfaces/jwt/jwt.service.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly createAccessTokenUseCase: CreateAccessTokenUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly createRecoverPasswordTokenUseCase: CreateRecoverPasswordTokenUseCase,
    private readonly updatePasswordUseCase: UpdatePasswordUseCase,
    private readonly oAuth2AuthenticationUseCase: OAuth2AuthenticationUseCase,
    private readonly passportGoogleStrategy: PassportGoogleStrategy,
    private readonly passportGithubStrategy: PassportGithubStrategy,
    @Inject('IJwtService')
    private readonly jwtService: IJwtService,
  ) {}

  @Public()
  @Post('token')
  async AccessToken(
    @Body() credentialDto: CredentiaslRequestDto,
  ): Promise<AccessTokenResponseDto> {
    return await this.createAccessTokenUseCase.execute(credentialDto);
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenRequestDto,
  ): Promise<AccessTokenResponseDto> {
    return await this.refreshTokenUseCase.execute(refreshTokenDto);
  }

  @Public()
  @Post('recover-password/token/:email')
  async recoverPasswordToken(@Param() email: string) {
    return this.createRecoverPasswordTokenUseCase.execute({ email });
  }

  @Public()
  @Post('reset-password')
  @HttpCode(200)
  async updatePassword(@Body() dto: RecoverPassordRequestDto) {
    return await this.updatePasswordUseCase.execute(dto);
  }

  @Get('oauth2/callback/google')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req: any) {
    return this.oAuth2AuthenticationUseCase.execute(req.user);
  }

  @Public()
  @Post('/redirect/github')
  async githubLoginCallback(@Body() { code }: { code: string }) {
    const { user } =
      await this.passportGithubStrategy.getGithubAccessToken(code);
    console.log(user);
    return this.oAuth2AuthenticationUseCase.execute(user);
  }

  @Public()
  @Post('/redirect/google')
  async googleCallback(@Body() { idToken }: { idToken: string }) {
    const user = await this.passportGoogleStrategy.validateTokenWithGoogle({
      idToken,
    });
    return this.oAuth2AuthenticationUseCase.execute(user);
  }

  @Public()
  @Get('/.well-known/jwks.json')
  async jwks() {
    return this.jwtService.getJwks();
  }
}
