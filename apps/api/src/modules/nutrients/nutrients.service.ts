import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateNutrientInput,
  ListNutrientsQuery,
  Nutrient,
  NutrientTranslationInput,
  PaginatedNutrients,
  UpdateNutrientInput,
} from '@repo/contracts';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Prisma } from '../../generated/prisma/client.js';
import { NUTRIENT_INCLUDE, toNutrient } from './nutrient.response.js';

/**
 * Owns the `Nutrient` lifecycle: the `nutrients` row (code + default unit + icon)
 * plus its localized `translations` (name + description).
 */
@Injectable()
export class NutrientsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListNutrientsQuery): Promise<PaginatedNutrients> {
    const { search, page, pageSize } = query;

    const where: Prisma.NutrientWhereInput = search
      ? {
          // Search matches the `code` or any translation `name`.
          OR: [
            { code: { contains: search, mode: 'insensitive' } },
            { translations: { some: { name: { contains: search, mode: 'insensitive' } } } },
          ],
        }
      : {};

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.nutrient.findMany({
        where,
        orderBy: { code: 'asc' },
        include: NUTRIENT_INCLUDE,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.nutrient.count({ where }),
    ]);

    return {
      items: rows.map(toNutrient),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getById(id: string): Promise<Nutrient> {
    const row = await this.prisma.nutrient.findUnique({
      where: { id },
      include: NUTRIENT_INCLUDE,
    });

    if (!row) {
      throw new NotFoundException(`Nutrient ${id} not found.`);
    }

    return toNutrient(row);
  }

  async create(input: CreateNutrientInput): Promise<Nutrient> {
    const row = await this.prisma.nutrient.create({
      data: {
        code: input.code,
        defaultUnitId: input.defaultUnitId,
        iconPath: input.iconPath ?? null,
        translations: { create: input.translations.map(toTranslationCreate) },
      },
      include: NUTRIENT_INCLUDE,
    });

    return toNutrient(row);
  }

  async update(id: string, input: UpdateNutrientInput): Promise<Nutrient> {
    const { translations, ...scalars } = input;

    const row = await this.prisma.nutrient.update({
      where: { id },
      data: {
        ...scalars,
        // A supplied array replaces the whole translation set.
        ...(translations
          ? { translations: { deleteMany: {}, create: translations.map(toTranslationCreate) } }
          : {}),
      },
      include: NUTRIENT_INCLUDE,
    });

    return toNutrient(row);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.nutrient.delete({ where: { id } });
  }
}

function toTranslationCreate(translation: NutrientTranslationInput) {
  return {
    languageCode: translation.languageCode,
    name: translation.name,
    description: translation.description ?? null,
  };
}
