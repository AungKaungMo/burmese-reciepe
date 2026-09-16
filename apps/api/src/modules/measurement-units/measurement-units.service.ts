import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateMeasurementUnitInput,
  ListMeasurementUnitsQuery,
  MeasurementUnit,
  MeasurementUnitTranslation,
  PaginatedMeasurementUnits,
  UpdateMeasurementUnitInput,
} from '@repo/contracts';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Prisma } from '../../generated/prisma/client.js';
import { MEASUREMENT_UNIT_INCLUDE, toMeasurementUnit } from './measurement-unit.response.js';

/**
 * Owns the `MeasurementUnit` lifecycle: the `measurement_units` row (code + symbol)
 * plus its localized `translations` (name + short label).
 */
@Injectable()
export class MeasurementUnitsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListMeasurementUnitsQuery): Promise<PaginatedMeasurementUnits> {
    const { search, page, pageSize } = query;

    const where: Prisma.MeasurementUnitWhereInput = search
      ? {
          // Search matches the `code`, `symbol` or any translation `name`.
          OR: [
            { code: { contains: search, mode: 'insensitive' } },
            { symbol: { contains: search, mode: 'insensitive' } },
            { translations: { some: { name: { contains: search, mode: 'insensitive' } } } },
          ],
        }
      : {};

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.measurementUnit.findMany({
        where,
        orderBy: { code: 'asc' },
        include: MEASUREMENT_UNIT_INCLUDE,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.measurementUnit.count({ where }),
    ]);

    return {
      items: rows.map(toMeasurementUnit),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getById(id: string): Promise<MeasurementUnit> {
    const row = await this.prisma.measurementUnit.findUnique({
      where: { id },
      include: MEASUREMENT_UNIT_INCLUDE,
    });

    if (!row) {
      throw new NotFoundException(`Measurement unit ${id} not found.`);
    }

    return toMeasurementUnit(row);
  }

  async create(input: CreateMeasurementUnitInput): Promise<MeasurementUnit> {
    const row = await this.prisma.measurementUnit.create({
      data: {
        code: input.code,
        symbol: input.symbol,
        translations: { create: input.translations.map(toTranslationCreate) },
      },
      include: MEASUREMENT_UNIT_INCLUDE,
    });

    return toMeasurementUnit(row);
  }

  async update(id: string, input: UpdateMeasurementUnitInput): Promise<MeasurementUnit> {
    const { translations, ...scalars } = input;

    const row = await this.prisma.measurementUnit.update({
      where: { id },
      data: {
        ...scalars,
        // A supplied array replaces the whole translation set.
        ...(translations
          ? { translations: { deleteMany: {}, create: translations.map(toTranslationCreate) } }
          : {}),
      },
      include: MEASUREMENT_UNIT_INCLUDE,
    });

    return toMeasurementUnit(row);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.measurementUnit.delete({ where: { id } });
  }
}

function toTranslationCreate(translation: MeasurementUnitTranslation) {
  return {
    languageCode: translation.languageCode,
    name: translation.name,
    shortLabel: translation.shortLabel,
  };
}
