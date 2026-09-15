import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { RecipesController } from './recipes.controller.js';
import { RecipesService } from './recipes.service.js';

/** Recipes with their translations, ordered steps and category links. */
@Module({
  imports: [AuthModule],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {}
