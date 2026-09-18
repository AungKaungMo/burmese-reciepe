import {
  ForbiddenException,
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service.js';

/**
 * Restricts a route to admins. Must run *after* {@link SupabaseJwtGuard} (which
 * populates `request.authUser`): the JWT only carries Supabase's role claim, so the
 * app-side `UserRole` is read from the `profiles` table here.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authUser = request.authUser;

    if (!authUser) {
      throw new ForbiddenException('Not authenticated.');
    }

    const profile = await this.prisma.profile.findUnique({
      where: { id: authUser.id },
      select: { role: true },
    });

    if (profile?.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access is required.');
    }

    return true;
  }
}
