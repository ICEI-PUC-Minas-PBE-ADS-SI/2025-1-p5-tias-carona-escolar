import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthCheckController {
  constructor() {}

  @Get()
  async healthCheck() {
    return "I'm alive!";
  }
}
