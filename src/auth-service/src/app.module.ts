import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaService } from './utils/prisma.service';
import { AuthModule } from './auth/auth.module';
import { S3Module } from './s3/s3.module';
import { HealthCheckController } from './health-chek.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [HealthCheckController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    S3Module,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
