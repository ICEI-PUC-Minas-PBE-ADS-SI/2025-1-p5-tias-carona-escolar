import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IJwtService } from 'src/auth/core/interfaces/jwt/jwt.service.interface';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class JwtServiceImpl implements IJwtService {
  private readonly publicKey: string;
  private readonly kid: string;
  private readonly modulus: string;
  private readonly exponent: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.kid = configService.get<string>('JWT_KID', 'auth-server');
    const publicKeyPath = configService.get<string>('PUBLIC_KEY_PATH');
    this.publicKey = fs.readFileSync(path.resolve(publicKeyPath), 'utf8');
    const publicKeyBuffer = crypto.createPublicKey(this.publicKey);

    const keyObject = publicKeyBuffer.export({ format: 'jwk' });
    this.modulus = keyObject.n;
    this.exponent = keyObject.e;
  }

  sign(payload: any): string {
    return this.jwtService.sign(payload, { header: { kid: this.kid, alg: 'RS256' } });
  }
  async verify(token: string) {
    return this.jwtService.verify(token);
  }
  async decode(token: string) {
    return this.jwtService.decode(token);
  }

  getJwks() {
    const jwks = {
      keys: [
        {
          kty: 'RSA',
          kid: this.kid,
          use: 'sig',
          alg: 'RS256',
          n: this.modulus,
          e: this.exponent,
        },
      ],
    };

    return jwks;
  }
}
