import { Module } from '@nestjs/common';
import { RideRequestController } from './controllers/ride-request.controller';
import { RideRequestRepository } from './repositories/ride-request.repository';
import { RideRequestService } from './services/ride-request.service';
import { PrismaService } from '../utils/prisma.service';

@Module({
  imports: [],
  controllers: [RideRequestController],
  providers: [PrismaService, RideRequestRepository, RideRequestService],
  exports: [],
})
export class RideRequestModule {}
