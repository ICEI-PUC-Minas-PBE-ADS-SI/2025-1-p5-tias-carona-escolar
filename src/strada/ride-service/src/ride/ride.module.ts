import { Module } from '@nestjs/common';
import { PrismaService } from '../utils/prisma.service';
import { RideController } from './controllers/ride.controller';
import { RideService } from './services/ride.service';
import { RideRepository } from './repositories/ride.repository';

@Module({
  imports: [],
  controllers: [RideController],
  providers: [PrismaService, RideService, RideRepository],
  exports: [],
})
export class RideModule {}
