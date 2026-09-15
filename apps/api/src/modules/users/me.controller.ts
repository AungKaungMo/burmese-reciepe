import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { SupabaseJwtGuard } from '../auth/supabase-jwt.guard.js';
import type { AuthUser, Profile } from '@repo/contracts';
import { toProfile } from './me.response.js';
import { UsersService } from './users.service.js';

@Controller('me')
@UseGuards(SupabaseJwtGuard)
export class MeController {
  constructor(private readonly users: UsersService) {}

  /**
   * Returns the authenticated user's profile, provisioning it on first call.
   * Clients hit this after a successful Supabase login to sync app-side data.
   */
  @Get()
  async getMe(@CurrentUser() authUser: AuthUser): Promise<Profile> {
    const profile = await this.users.provision(authUser);
    return toProfile(profile, authUser);
  }
}
