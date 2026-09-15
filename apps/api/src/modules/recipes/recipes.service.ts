import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateRecipeInput,
  ListRecipesQuery,
  PaginatedRecipes,
  Recipe,
  RecipeStepInput,
  RecipeTranslationInput,
  UpdateRecipeInput,
} from '@repo/contracts';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Prisma } from '../../generated/prisma/client.js';
import { RECIPE_INCLUDE, toRecipe } from './recipe.response.js';

/**
 * Owns the `Recipe` lifecycle: the `recipes` row plus its localized `translations`,
 * ordered `steps` (with their own translations) and linked category ids.
 */
@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListRecipesQuery): Promise<PaginatedRecipes> {
    const { status, difficulty, cuisineCode, isFeatured, search, page, pageSize } = query;

    const where: Prisma.RecipeWhereInput = {
      status,
      difficulty,
      cuisineCode,
      isFeatured,
      // Search matches the `slug` or any translation `title`.
      ...(search
        ? {
            OR: [
              { slug: { contains: search, mode: 'insensitive' } },
              { translations: { some: { title: { contains: search, mode: 'insensitive' } } } },
            ],
          }
        : {}),
    };

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.recipe.findMany({
        where,
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        include: RECIPE_INCLUDE,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.recipe.count({ where }),
    ]);

    return {
      items: rows.map(toRecipe),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getById(id: string): Promise<Recipe> {
    const row = await this.prisma.recipe.findUnique({
      where: { id },
      include: RECIPE_INCLUDE,
    });

    if (!row) {
      throw new NotFoundException(`Recipe ${id} not found.`);
    }

    return toRecipe(row);
  }

  async create(input: CreateRecipeInput): Promise<Recipe> {
    const row = await this.prisma.recipe.create({
      data: {
        slug: input.slug,
        status: input.status,
        cuisineCode: input.cuisineCode,
        coverImagePath: input.coverImagePath ?? null,
        servings: input.servings,
        prepMinutes: input.prepMinutes,
        cookMinutes: input.cookMinutes,
        difficulty: input.difficulty,
        spiceLevel: input.spiceLevel,
        isFeatured: input.isFeatured,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
        translations: { create: input.translations.map(toTranslationCreate) },
        categoryLinks: { create: input.categoryIds.map((categoryId) => ({ categoryId })) },
        reciepeSteps: { create: input.steps.map(toStepCreate) },
      },
      include: RECIPE_INCLUDE,
    });

    return toRecipe(row);
  }

  async update(id: string, input: UpdateRecipeInput): Promise<Recipe> {
    const { translations, categoryIds, steps, publishedAt, ...scalars } = input;

    const row = await this.prisma.recipe.update({
      where: { id },
      data: {
        ...scalars,
        ...(publishedAt !== undefined
          ? { publishedAt: publishedAt ? new Date(publishedAt) : null }
          : {}),
        // A supplied array replaces the whole corresponding set.
        ...(translations
          ? { translations: { deleteMany: {}, create: translations.map(toTranslationCreate) } }
          : {}),
        ...(categoryIds
          ? {
              categoryLinks: {
                deleteMany: {},
                create: categoryIds.map((categoryId) => ({ categoryId })),
              },
            }
          : {}),
        ...(steps ? { reciepeSteps: { deleteMany: {}, create: steps.map(toStepCreate) } } : {}),
      },
      include: RECIPE_INCLUDE,
    });

    return toRecipe(row);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.recipe.delete({ where: { id } });
  }
}

function toTranslationCreate(translation: RecipeTranslationInput) {
  return {
    languageCode: translation.languageCode,
    title: translation.title,
    summary: translation.summary ?? null,
    overview: translation.overview ?? null,
    goodToKnow: translation.goodToKnow,
    servingSuggestions: translation.servingSuggestions,
    searchKeywords: translation.searchKeywords,
    status: translation.status,
  };
}

function toStepCreate(step: RecipeStepInput) {
  return {
    position: step.position,
    durationSeconds: step.durationSeconds ?? null,
    translations: {
      create: step.translations.map((translation) => ({
        languageCode: translation.languageCode,
        instruction: translation.instruction,
        timerLabel: translation.timerLabel ?? null,
        completionCue: translation.completionCue ?? null,
        tip: translation.tip ?? null,
        warning: translation.warning ?? null,
      })),
    },
  };
}
