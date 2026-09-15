import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService, type HealthStatus } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  getHealth(): Promise<HealthStatus> {
    return this.appService.getHealth();
  }
}
