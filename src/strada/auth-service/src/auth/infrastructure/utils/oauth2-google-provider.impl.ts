import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserRequestDto } from '@/src/user/infrastructure/dto/user-request.dto';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem';

@Injectable()
export class PassportGoogleStrategy extends PassportStrategy(
  GoogleStrategy,
  'google',
) {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const user = new UserRequestDto({
      email: profile.emails[0].value,
      name: profile.displayName,
      imgUrl: profile.photos[0]?.value,
      username: profile.name.givenName,
      authProvider: 'oauth2',
    });

    return user;
  }

  async validateTokenWithGoogle({
    idToken,
  }: {
    idToken: string;
  }): Promise<UserRequestDto> {
    try {
      const decoded = jwt.decode(idToken, { complete: true });

      const publickey = await this.getGooglePublicKey().then((keys) => {
        const key = keys.find((k) => k.kid === decoded.header.kid);
        return jwkToPem(key);
      });

      jwt.verify(idToken, publickey, { algorithms: ['RS256'] }, (err) => {
        if (err) {
          console.log('Error:', err);
          throw new UnauthorizedException('Token inválido');
        }
      });
      const { email, name, picture, given_name } = decoded.payload as any;

      const user = new UserRequestDto({
        email,
        name,
        imgUrl: picture,
        username: given_name,
        authProvider: 'oauth2',
      });

      return user;
    } catch (error) {
      console.log('Erro ao validar token com Google');
      console.error(error);
      throw new Error('Token inválido ou expirado');
    }
  }

  private async getGooglePublicKey() {
    const response = await axios.get(
      'https://www.googleapis.com/oauth2/v3/certs',
    );
    return response.data.keys;
  }
}
