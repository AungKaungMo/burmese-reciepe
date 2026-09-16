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
  createNutrientSchema,
  listNutrientsQuerySchema,
  updateNutrientSchema,
  type CreateNutrientInput,
  type ListNutrientsQuery,
  type Nutrient,
  type PaginatedNutrients,
  type UpdateNutrientInput,
} from '@repo/contracts';
import { ZodValidationPipe } from '../../common/zod-validation.pipe.js';
import { SupabaseJwtGuard } from '../auth/supabase-jwt.guard.js';
import { NutrientsService } from './nutrients.service.js';

/** CRUD for nutrients and their translations. */
@Controller('nutrients')
@UseGuards(SupabaseJwtGuard)
export class NutrientsController {
  constructor(private readonly nutrients: NutrientsService) {}

  @Get()
  list(
    @Query(new ZodValidationPipe(listNutrientsQuerySchema))
    query: ListNutrientsQuery,
  ): Promise<PaginatedNutrients> {
    return this.nutrients.list(query);
  }

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string): Promise<Nutrient> {
    return this.nutrients.getById(id);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(createNutrientSchema))
    input: CreateNutrientInput,
  ): Promise<Nutrient> {
    return this.nutrients.create(input);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateNutrientSchema))
    input: UpdateNutrientInput,
  ): Promise<Nutrient> {
    return this.nutrients.update(id, input);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.nutrients.remove(id);
  }
}
