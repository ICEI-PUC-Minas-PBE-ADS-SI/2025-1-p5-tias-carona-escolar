import { Module } from '@nestjs/common';
import { HealthCheckController } from './health-chek.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './utils/prisma.service';
import { RideModule } from './ride/ride.module';
import { RideRequestModule } from './ride-request/ride-request.module';

@Module({
  controllers: [HealthCheckController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RideModule,
    RideRequestModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
