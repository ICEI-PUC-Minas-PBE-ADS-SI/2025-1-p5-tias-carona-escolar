import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/infrastructure/utils/auth.public';

@Controller()
export class HealthCheckController {
  constructor() {}

  @Public()
  @Get()
  async healthCheck() {
    return "I'm alive!";
  }
}
