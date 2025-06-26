import { Module } from '@nestjs/common';
import { RatingController } from './controllers/rating.controller';
import { RatingService } from './services/rating.service';
import { RatingRepository } from './repositories/rating.repository';
import { PrismaService } from '../utils/prisma.service';

@Module({
  controllers: [RatingController],
  providers: [RatingService, RatingRepository, PrismaService],
  exports: [RatingService],
})
export class RatingModule {}