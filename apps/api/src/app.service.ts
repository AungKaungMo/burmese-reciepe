import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';

export interface HealthStatus {
  status: 'ok' | 'error';
  db: 'up' | 'down';
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  /**
   * Liveness + DB readiness. Runs a trivial query so a passing response proves
   * the API can actually reach Postgres, not just that the process is up.
   */
  async getHealth(): Promise<HealthStatus> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', db: 'up' };
    } catch (error) {
      this.logger.error('Database health check failed', error as Error);
      return { status: 'error', db: 'down' };
    }
  }
}
