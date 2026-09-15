import { Module } from '@nestjs/common';
import { SupabaseJwtGuard } from './supabase-jwt.guard.js';

/**
 * Token verification and current-user context. Exposes the guard so feature
 * modules can protect their routes; ConfigModule is global, so no imports needed.
 */
@Module({
  providers: [SupabaseJwtGuard],
  exports: [SupabaseJwtGuard],
})
export class AuthModule {}
