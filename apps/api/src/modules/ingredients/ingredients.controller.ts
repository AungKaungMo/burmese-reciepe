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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  createIngredientSchema,
  listIngredientsQuerySchema,
  updateIngredientSchema,
  type CreateIngredientInput,
  type ImportResult,
  type Ingredient,
  type ListIngredientsQuery,
  type PaginatedIngredients,
  type UpdateIngredientInput,
} from '@repo/contracts';
import { ZodValidationPipe } from '../../common/zod-validation.pipe.js';
import {
  MAX_IMPORT_BYTES,
  requireXlsxBuffer,
  type UploadedXlsx,
} from '../../common/xlsx-import.js';
import { AdminGuard } from '../auth/admin.guard.js';
import { SupabaseJwtGuard } from '../auth/supabase-jwt.guard.js';
import { IngredientsService } from './ingredients.service.js';

/** CRUD for ingredients and their translations. */
@Controller('ingredients')
@UseGuards(SupabaseJwtGuard, AdminGuard)
export class IngredientsController {
  constructor(private readonly ingredients: IngredientsService) {}

  @Get()
  list(
    @Query(new ZodValidationPipe(listIngredientsQuerySchema))
    query: ListIngredientsQuery,
  ): Promise<PaginatedIngredients> {
    return this.ingredients.list(query);
  }

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string): Promise<Ingredient> {
    return this.ingredients.getById(id);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(createIngredientSchema))
    input: CreateIngredientInput,
  ): Promise<Ingredient> {
    return this.ingredients.create(input);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_IMPORT_BYTES } }))
  import(@UploadedFile() file?: UploadedXlsx): Promise<ImportResult> {
    return this.ingredients.importFromXlsx(requireXlsxBuffer(file));
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateIngredientSchema))
    input: UpdateIngredientInput,
  ): Promise<Ingredient> {
    return this.ingredients.update(id, input);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.ingredients.remove(id);
  }
}
