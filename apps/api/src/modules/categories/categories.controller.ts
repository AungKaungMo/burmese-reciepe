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
  createCategorySchema,
  listCategoriesQuerySchema,
  updateCategorySchema,
  type Category,
  type CreateCategoryInput,
  type ImportResult,
  type ListCategoriesQuery,
  type PaginatedCategories,
  type UpdateCategoryInput,
} from '@repo/contracts';
import { ZodValidationPipe } from '../../common/zod-validation.pipe.js';
import {
  MAX_IMPORT_BYTES,
  requireXlsxBuffer,
  type UploadedXlsx,
} from '../../common/xlsx-import.js';
import { SupabaseJwtGuard } from '../auth/supabase-jwt.guard.js';
import { CategoriesService } from './categories.service.js';

/** CRUD for recipe/ingredient categories and their translations. */
@Controller('categories')
@UseGuards(SupabaseJwtGuard)
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Get()
  list(
    @Query(new ZodValidationPipe(listCategoriesQuerySchema))
    query: ListCategoriesQuery,
  ): Promise<PaginatedCategories> {
    return this.categories.list(query);
  }

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string): Promise<Category> {
    return this.categories.getById(id);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(createCategorySchema))
    input: CreateCategoryInput,
  ): Promise<Category> {
    return this.categories.create(input);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_IMPORT_BYTES } }))
  import(@UploadedFile() file?: UploadedXlsx): Promise<ImportResult> {
    return this.categories.importFromXlsx(requireXlsxBuffer(file));
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateCategorySchema))
    input: UpdateCategoryInput,
  ): Promise<Category> {
    return this.categories.update(id, input);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.categories.remove(id);
  }
}
