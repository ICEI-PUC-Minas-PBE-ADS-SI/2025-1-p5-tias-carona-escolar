import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as GitHubStrategy } from 'passport-github';
import { UserRequestDto } from '@/src/user/infrastructure/dto/user-request.dto';
import axios from 'axios';

@Injectable()
export class PassportGithubStrategy extends PassportStrategy(
  GitHubStrategy,
  'github',
) {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const user = new UserRequestDto({
      email: profile.emails?.[0]?.value ?? profile.username,
      name: profile.displayName,
      imgUrl: profile.photos[0]?.value ?? '',
      username: profile.username,
    });

    return user;
  }

  /**
   * Função para buscar o token e os dados do usuário no backend
   * usando o código de autorização fornecido pelo GitHub.
   *
   * @param code O código de autorização enviado pelo GitHub
   * @returns Dados do usuário e token de acesso
   */
  async getGithubAccessToken(code: string) {
    try {
      const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );

      const { access_token } = tokenResponse.data;

      if (!access_token) {
        throw new Error('Failed to obtain access token from GitHub');
      }

      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const profile = userResponse.data;

      const user = new UserRequestDto({
        email:
          profile.email ?? `${profile.username ?? profile.login}@github.com`,
        name: profile.name ?? profile.login,
        imgUrl: profile.avatar_url ?? '',
        username: profile.login,
        authProvider: 'oauth2',
      });

      return { access_token, user };
    } catch (error) {
      console.error('Error fetching access token or user data:', error);
      throw new Error(
        'Failed to authenticate with GitHub. Please try again later.',
      );
    }
  }
}
