import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  createRecipeSchema,
  listRecipesQuerySchema,
  updateRecipeSchema,
  type CreateRecipeInput,
  type ListRecipesQuery,
  type PaginatedRecipes,
  type Recipe,
  type UpdateRecipeInput,
} from '@repo/contracts';
import { ZodValidationPipe } from '../../common/zod-validation.pipe.js';
import { SupabaseJwtGuard } from '../auth/supabase-jwt.guard.js';
import { RecipesService } from './recipes.service.js';

/** CRUD for recipes, their translations, steps and category links. */
@Controller('recipes')
@UseGuards(SupabaseJwtGuard)
export class RecipesController {
  constructor(private readonly recipes: RecipesService) {}

  @Get()
  list(
    @Query(new ZodValidationPipe(listRecipesQuerySchema))
    query: ListRecipesQuery,
  ): Promise<PaginatedRecipes> {
    return this.recipes.list(query);
  }

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string): Promise<Recipe> {
    return this.recipes.getById(id);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(createRecipeSchema))
    input: CreateRecipeInput,
  ): Promise<Recipe> {
    return this.recipes.create(input);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateRecipeSchema))
    input: UpdateRecipeInput,
  ): Promise<Recipe> {
    return this.recipes.update(id, input);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.recipes.remove(id);
  }
}
