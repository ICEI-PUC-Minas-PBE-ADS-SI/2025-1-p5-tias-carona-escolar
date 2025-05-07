import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { UploadController } from './s3.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [UploadController],
  providers: [S3Service, ConfigService],
  exports: [],
})
export class S3Module {}
