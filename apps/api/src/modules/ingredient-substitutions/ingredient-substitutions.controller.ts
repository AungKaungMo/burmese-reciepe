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
  createIngredientSubstitutionSchema,
  listIngredientSubstitutionsQuerySchema,
  updateIngredientSubstitutionSchema,
  type CreateIngredientSubstitutionInput,
  type IngredientSubstitution,
  type ListIngredientSubstitutionsQuery,
  type PaginatedIngredientSubstitutions,
  type UpdateIngredientSubstitutionInput,
} from '@repo/contracts';
import { ZodValidationPipe } from '../../common/zod-validation.pipe.js';
import { SupabaseJwtGuard } from '../auth/supabase-jwt.guard.js';
import { IngredientSubstitutionsService } from './ingredient-substitutions.service.js';

/** CRUD for ingredient substitutions and their translations. */
@Controller('ingredient-substitutions')
@UseGuards(SupabaseJwtGuard)
export class IngredientSubstitutionsController {
  constructor(private readonly substitutions: IngredientSubstitutionsService) {}

  @Get()
  list(
    @Query(new ZodValidationPipe(listIngredientSubstitutionsQuerySchema))
    query: ListIngredientSubstitutionsQuery,
  ): Promise<PaginatedIngredientSubstitutions> {
    return this.substitutions.list(query);
  }

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string): Promise<IngredientSubstitution> {
    return this.substitutions.getById(id);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(createIngredientSubstitutionSchema))
    input: CreateIngredientSubstitutionInput,
  ): Promise<IngredientSubstitution> {
    return this.substitutions.create(input);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateIngredientSubstitutionSchema))
    input: UpdateIngredientSubstitutionInput,
  ): Promise<IngredientSubstitution> {
    return this.substitutions.update(id, input);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.substitutions.remove(id);
  }
}
