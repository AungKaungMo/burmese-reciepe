import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateIngredientSubstitutionInput,
  IngredientSubstitution,
  IngredientSubstitutionTranslationInput,
  ListIngredientSubstitutionsQuery,
  PaginatedIngredientSubstitutions,
  UpdateIngredientSubstitutionInput,
} from '@repo/contracts';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Prisma } from '../../generated/prisma/client.js';
import {
  INGREDIENT_SUBSTITUTION_INCLUDE,
  toIngredientSubstitution,
} from './ingredient-substitution.response.js';

@Injectable()
export class IngredientSubstitutionsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(
    query: ListIngredientSubstitutionsQuery,
  ): Promise<PaginatedIngredientSubstitutions> {
    const { originalIngredientId, substituteIngredientId, isActive, page, pageSize } = query;

    const where: Prisma.IngredientSubstitutionWhereInput = {
      originalIngredientId,
      substituteIngredientId,
      isActive,
    };

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.ingredientSubstitution.findMany({
        where,
        orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
        include: INGREDIENT_SUBSTITUTION_INCLUDE,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.ingredientSubstitution.count({ where }),
    ]);

    return {
      items: rows.map(toIngredientSubstitution),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getById(id: string): Promise<IngredientSubstitution> {
    const row = await this.prisma.ingredientSubstitution.findUnique({
      where: { id },
      include: INGREDIENT_SUBSTITUTION_INCLUDE,
    });

    if (!row) {
      throw new NotFoundException(`Ingredient substitution ${id} not found.`);
    }

    return toIngredientSubstitution(row);
  }

  async create(input: CreateIngredientSubstitutionInput): Promise<IngredientSubstitution> {
    const row = await this.prisma.ingredientSubstitution.create({
      data: {
        originalIngredientId: input.originalIngredientId,
        substituteIngredientId: input.substituteIngredientId,
        originalAmount: input.originalAmount ?? null,
        originalUnitCode: input.originalUnitCode ?? null,
        substituteAmount: input.substituteAmount ?? null,
        substituteUnitCode: input.substituteUnitCode ?? null,
        priority: input.priority,
        isActive: input.isActive,
        translations: { create: input.translations.map(toTranslationCreate) },
      },
      include: INGREDIENT_SUBSTITUTION_INCLUDE,
    });

    return toIngredientSubstitution(row);
  }

  async update(
    id: string,
    input: UpdateIngredientSubstitutionInput,
  ): Promise<IngredientSubstitution> {
    const { translations, ...scalars } = input;

    const row = await this.prisma.ingredientSubstitution.update({
      where: { id },
      data: {
        ...scalars,
        // A supplied array replaces the whole translation set.
        ...(translations
          ? { translations: { deleteMany: {}, create: translations.map(toTranslationCreate) } }
          : {}),
      },
      include: INGREDIENT_SUBSTITUTION_INCLUDE,
    });

    return toIngredientSubstitution(row);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.ingredientSubstitution.delete({ where: { id } });
  }
}

function toTranslationCreate(translation: IngredientSubstitutionTranslationInput) {
  return {
    languageCode: translation.languageCode,
    usageInstruction: translation.usageInstruction ?? null,
    effectNote: translation.effectNote ?? null,
  };
}
