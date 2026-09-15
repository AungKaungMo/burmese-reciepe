import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { MeController } from './me.controller.js';
import { UsersService } from './users.service.js';

/** Profile, locale and preferences for the current user. */
@Module({
  imports: [AuthModule],
  controllers: [MeController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
