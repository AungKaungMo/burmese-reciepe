import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { IngredientSubstitutionsController } from './ingredient-substitutions.controller.js';
import { IngredientSubstitutionsService } from './ingredient-substitutions.service.js';

/** Ingredient substitutions (original ↔ substitute swaps) with their translations. */
@Module({
  imports: [AuthModule],
  controllers: [IngredientSubstitutionsController],
  providers: [IngredientSubstitutionsService],
  exports: [IngredientSubstitutionsService],
})
export class IngredientSubstitutionsModule {}
