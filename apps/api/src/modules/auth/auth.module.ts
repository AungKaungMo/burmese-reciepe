import { Module } from '@nestjs/common';
import { AdminGuard } from './admin.guard.js';
import { SupabaseJwtGuard } from './supabase-jwt.guard.js';

/**
 * Token verification and current-user context. Exposes the guards so feature
 * modules can protect their routes; ConfigModule is global, so no imports needed.
 */
@Module({
  providers: [SupabaseJwtGuard, AdminGuard],
  exports: [SupabaseJwtGuard, AdminGuard],
})
export class AuthModule {}
