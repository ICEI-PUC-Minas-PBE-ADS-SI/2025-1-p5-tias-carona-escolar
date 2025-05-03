import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from '@/src/utils/prisma.service';
import { CreateAccessTokenUseCase } from './core/use-cases/create-access-token.use-case';
import { FindUserByEmailUseCase } from '@/src/user/core/use-cases/find-user-by-email.use-case';
import { IJwtService } from './core/interfaces/jwt/jwt.service.interface';
import { IPasswordEncoder } from '@/src/auth/core/interfaces/utils/password-encoder.interface';
import { CreateRefreshTokenUseCase } from './core/use-cases/create-refresh-token.use-case';
import { PasswordEncoder } from '@/src/auth/infrastructure/utils/password-encoder.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtServiceImpl } from './infrastructure/utils/jwt.service';
import { RefreshTokenUseCase } from './core/use-cases/refresh-token.use-case';
import { RefreshTokenRepository } from './infrastructure/repositories/refresh-token-repository.impl';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { UserModule } from '@/src/user/user.module';
import { CreateRecoverPasswordTokenUseCase } from './core/use-cases/create-recover-password-token.use-case';
import { IRecoveryPasswordRepository } from './core/interfaces/repositories/recovery-password.repository';
import { IEmailService } from './core/interfaces/recover-password/email-service.interface';
import { UpdatePasswordUseCase } from './core/use-cases/update-password.use-case';
import { NodeMailerService } from './infrastructure/utils/nodemailer.service';
import { RecoveryPasswordRepository } from './infrastructure/repositories/recovery-password.repository.impl';
import { PassportGoogleStrategy } from './infrastructure/utils/oauth2-google-provider.impl';
import { PassportGithubStrategy } from './infrastructure/utils/oauth2-github-provider.impl';
import { OAuth2AuthenticationUseCase } from './core/use-cases/oauth2-authentication.use-case';
import { CreateUserUseCase } from '@/src/user/core/use-cases/create-user.use-case';
import { AuthGuard } from './infrastructure/utils/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UpdateUserPasswordUseCase } from '../user/core/use-cases/update-user-password.use-case';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const privateKeyPath = configService.get<string>('PRIVATE_KEY_PATH');
        const publicKeyPath = configService.get<string>('PUBLIC_KEY_PATH');

        const privateKey = fs.readFileSync(path.resolve(privateKeyPath), 'utf8');
        const publicKey = fs.readFileSync(path.resolve(publicKeyPath), 'utf8');

        return {
          global: true,
          privateKey: privateKey,
          publicKey: publicKey,
          signOptions: {
            algorithm: 'RS256',
            expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    PassportGoogleStrategy,
    PassportGithubStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: 'IPasswordEncoder',
      useClass: PasswordEncoder,
    },
    {
      provide: 'IRefreshTokenRepository',
      useClass: RefreshTokenRepository,
    },
    {
      provide: 'IJwtService',
      useClass: JwtServiceImpl,
    },
    {
      provide: 'IRecoveryPasswordRepository',
      useClass: RecoveryPasswordRepository,
    },
    {
      provide: 'IEmailService',
      useClass: NodeMailerService,
    },
    {
      provide: CreateAccessTokenUseCase,
      useFactory: (
        findUserByEmail: FindUserByEmailUseCase,
        jwtService: IJwtService,
        passwordEncoder: IPasswordEncoder,
        createRefreshTokenUseCase: CreateRefreshTokenUseCase,
      ) => {
        return new CreateAccessTokenUseCase(
          findUserByEmail,
          jwtService,
          passwordEncoder,
          createRefreshTokenUseCase,
        );
      },
      inject: [
        FindUserByEmailUseCase,
        'IJwtService',
        'IPasswordEncoder',
        CreateRefreshTokenUseCase,
      ],
    },
    {
      provide: CreateRefreshTokenUseCase,
      useFactory: (refreshTokenRepository: RefreshTokenRepository) => {
        return new CreateRefreshTokenUseCase(refreshTokenRepository);
      },
      inject: ['IRefreshTokenRepository'],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (
        refreshTokenRepository: RefreshTokenRepository,
        createRefreshTokenUseCase: CreateAccessTokenUseCase,
      ) => {
        return new RefreshTokenUseCase(
          refreshTokenRepository,
          createRefreshTokenUseCase,
        );
      },
      inject: ['IRefreshTokenRepository', CreateAccessTokenUseCase],
    },
    {
      provide: UpdatePasswordUseCase,
      useFactory: (
        recoverPasswordRepository: IRecoveryPasswordRepository,
        findByEmailUseCase: FindUserByEmailUseCase,
        updateUserPasswordUseCase: UpdateUserPasswordUseCase,
      ) => {
        return new UpdatePasswordUseCase(
          recoverPasswordRepository,
          findByEmailUseCase,
          updateUserPasswordUseCase,
        );
      },
      inject: [
        'IRecoveryPasswordRepository',
        FindUserByEmailUseCase,
        UpdateUserPasswordUseCase,
      ],
    },
    {
      provide: CreateRecoverPasswordTokenUseCase,
      useFactory: (
        recoveryPasswordRepository: IRecoveryPasswordRepository,
        findByEmailUseCase: FindUserByEmailUseCase,
        emailService: IEmailService,
      ) => {
        return new CreateRecoverPasswordTokenUseCase(
          recoveryPasswordRepository,
          findByEmailUseCase,
          emailService,
        );
      },
      inject: [
        'IRecoveryPasswordRepository',
        FindUserByEmailUseCase,
        'IEmailService',
      ],
    },
    {
      provide: OAuth2AuthenticationUseCase,
      useFactory: (
        createUserUseCase: CreateUserUseCase,
        createAccessTokenUseCase: CreateAccessTokenUseCase,
      ) => {
        return new OAuth2AuthenticationUseCase(
          createUserUseCase,
          createAccessTokenUseCase,
        );
      },
      inject: [CreateUserUseCase, CreateAccessTokenUseCase],
    },
  ],
  exports: ['IPasswordEncoder'],
})
export class AuthModule {}
