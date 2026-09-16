import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { NutrientsController } from './nutrients.controller.js';
import { NutrientsService } from './nutrients.service.js';

/** Nutrients (code + default unit) with their localized translations. */
@Module({
  imports: [AuthModule],
  controllers: [NutrientsController],
  providers: [NutrientsService],
  exports: [NutrientsService],
})
export class NutrientsModule {}
