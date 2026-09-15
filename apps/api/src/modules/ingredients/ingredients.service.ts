import { Injectable, NotFoundException } from '@nestjs/common';
import {
  createIngredientSchema,
  type CreateIngredientInput,
  type Ingredient,
  type IngredientTranslationInput,
  type ImportResult,
  type ListIngredientsQuery,
  type PaginatedIngredients,
  type UpdateIngredientInput,
} from '@repo/contracts';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Prisma } from '../../generated/prisma/client.js';
import { importRowsFromXlsx } from '../../common/xlsx-import.js';
import { makeRowToIngredientInput } from './ingredient-import.js';
import { INGREDIENT_INCLUDE, toIngredient } from './ingredient.response.js';

/**
 * Owns the `Ingredient` lifecycle: the `ingredients` row plus its localized
 * `translations` (name + search aliases).
 */
@Injectable()
export class IngredientsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListIngredientsQuery): Promise<PaginatedIngredients> {
    const { categoryId, isActive, search, page, pageSize } = query;

    const where: Prisma.IngredientWhereInput = {
      categoryId,
      isActive,
      // Search matches the `code` or any translation `name`.
      ...(search
        ? {
            OR: [
              { code: { contains: search, mode: 'insensitive' } },
              { translations: { some: { name: { contains: search, mode: 'insensitive' } } } },
            ],
          }
        : {}),
    };

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.ingredient.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: INGREDIENT_INCLUDE,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.ingredient.count({ where }),
    ]);

    return {
      items: rows.map(toIngredient),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getById(id: string): Promise<Ingredient> {
    const row = await this.prisma.ingredient.findUnique({
      where: { id },
      include: INGREDIENT_INCLUDE,
    });

    if (!row) {
      throw new NotFoundException(`Ingredient ${id} not found.`);
    }

    return toIngredient(row);
  }

  async create(input: CreateIngredientInput): Promise<Ingredient> {
    const row = await this.prisma.ingredient.create({
      data: {
        code: input.code,
        categoryId: input.categoryId,
        defaultUnitId: input.defaultUnitId ?? null,
        emoji: input.emoji ?? null,
        iconPath: input.iconPath ?? null,
        isActive: input.isActive,
        translations: { create: input.translations.map(toTranslationCreate) },
      },
      include: INGREDIENT_INCLUDE,
    });

    return toIngredient(row);
  }

  async update(id: string, input: UpdateIngredientInput): Promise<Ingredient> {
    const { translations, ...scalars } = input;

    const row = await this.prisma.ingredient.update({
      where: { id },
      data: {
        ...scalars,
        // A supplied array replaces the whole translation set.
        ...(translations
          ? { translations: { deleteMany: {}, create: translations.map(toTranslationCreate) } }
          : {}),
      },
      include: INGREDIENT_INCLUDE,
    });

    return toIngredient(row);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.ingredient.delete({ where: { id } });
  }

  /**
   * Bulk-creates ingredients from an xlsx buffer. Categories are referenced by their
   * human-readable `code`, resolved to ids here; rows with an unknown category code
   * are reported rather than created. Delegates the parse/validate/create loop to
   * the shared importer.
   */
  async importFromXlsx(buffer: Buffer): Promise<ImportResult> {
    const categories = await this.prisma.category.findMany({
      where: { scope: 'INGREDIENT' },
      select: { id: true, code: true },
    });
    const categoryIdByCode = new Map(categories.map((c) => [c.code.toLowerCase(), c.id]));

    return importRowsFromXlsx(buffer, {
      rowToInput: makeRowToIngredientInput(categoryIdByCode),
      schema: createIngredientSchema,
      createOne: (input) => this.create(input),
      preValidate: (candidate) =>
        (candidate as { categoryId?: string }).categoryId
          ? null
          : 'category_code is missing or does not match an existing ingredient category.',
      onConflictMessage: 'An ingredient with this code already exists.',
    });
  }
}

function toTranslationCreate(translation: IngredientTranslationInput) {
  return {
    languageCode: translation.languageCode,
    name: translation.name,
    aliases: translation.aliases,
  };
}
