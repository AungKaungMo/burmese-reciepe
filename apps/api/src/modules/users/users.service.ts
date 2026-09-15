import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { AuthUser } from '@repo/contracts';
import type { Profile } from '../../generated/prisma/client.js';

/**
 * Owns the `Profile` lifecycle. A profile mirrors a Supabase auth user (shared
 * UUID) and holds the app-side data Supabase Auth does not.
 */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns the caller's profile, creating it on first sight. Called by `/v1/me`
   * right after a Supabase login, so the row is provisioned lazily and idempotently.
   */
  async provision(authUser: AuthUser): Promise<Profile> {
    return this.prisma.profile.upsert({
      where: { id: authUser.id },
      create: { id: authUser.id },
      update: {},
    });
  }
}
