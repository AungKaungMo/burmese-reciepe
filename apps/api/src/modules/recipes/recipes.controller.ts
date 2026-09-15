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
  createRecipeSchema,
  listRecipesQuerySchema,
  updateRecipeSchema,
  type CreateRecipeInput,
  type ImportResult,
  type ListRecipesQuery,
  type PaginatedRecipes,
  type Recipe,
  type UpdateRecipeInput,
} from '@repo/contracts';
import { ZodValidationPipe } from '../../common/zod-validation.pipe.js';
import {
  MAX_IMPORT_BYTES,
  requireXlsxBuffer,
  type UploadedXlsx,
} from '../../common/xlsx-import.js';
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

  @Post('import')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_IMPORT_BYTES } }))
  import(@UploadedFile() file?: UploadedXlsx): Promise<ImportResult> {
    return this.recipes.importFromXlsx(requireXlsxBuffer(file));
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
