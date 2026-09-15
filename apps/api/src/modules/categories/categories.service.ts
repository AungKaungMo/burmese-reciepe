import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  Category,
  CreateCategoryInput,
  ListCategoriesQuery,
  PaginatedCategories,
  UpdateCategoryInput,
} from '@repo/contracts';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Prisma } from '../../generated/prisma/client.js';
import { toCategory } from './category.response.js';

/**
 * Owns the `Category` lifecycle, including its localized `translations`. A category
 * pairs a machine `code` (unique per `scope`) with one row of text per language.
 */
@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListCategoriesQuery): Promise<PaginatedCategories> {
    const { scope, isActive, search, page, pageSize } = query;

    const where: Prisma.CategoryWhereInput = {
      scope,
      isActive,
      // Search matches the machine `code` or any translation `name`.
      ...(search
        ? {
            OR: [
              { code: { contains: search, mode: 'insensitive' } },
              {
                translations: {
                  some: { name: { contains: search, mode: 'insensitive' } },
                },
              },
            ],
          }
        : {}),
    };

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        where,
        orderBy: [{ scope: 'asc' }, { sortOrder: 'asc' }],
        include: { translations: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      items: rows.map(toCategory),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getById(id: string): Promise<Category> {
    const row = await this.prisma.category.findUnique({
      where: { id },
      include: { translations: true },
    });

    if (!row) {
      throw new NotFoundException(`Category ${id} not found.`);
    }

    return toCategory(row);
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    const row = await this.prisma.category.create({
      data: {
        scope: input.scope,
        code: input.code,
        iconPath: input.iconPath ?? null,
        sortOrder: input.sortOrder,
        isActive: input.isActive,
        translations: {
          create: input.translations.map((translation) => ({
            languageCode: translation.languageCode,
            name: translation.name,
            description: translation.description,
          })),
        },
      },
      include: { translations: true },
    });

    return toCategory(row);
  }

  async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    const { translations, ...scalars } = input;

    const row = await this.prisma.category.update({
      where: { id },
      data: {
        ...scalars,
        // A supplied `translations` array replaces the whole set.
        ...(translations
          ? {
              translations: {
                deleteMany: {},
                create: translations.map((translation) => ({
                  languageCode: translation.languageCode,
                  name: translation.name,
                  description: translation.description,
                })),
              },
            }
          : {}),
      },
      include: { translations: true },
    });

    return toCategory(row);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }
}
