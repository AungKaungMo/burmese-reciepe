import type { MeasurementUnit } from '@repo/contracts';
import { Prisma } from '../../generated/prisma/client.js';

/** Prisma include used everywhere a full unit is loaded. */
export const MEASUREMENT_UNIT_INCLUDE = {
  translations: true,
} satisfies Prisma.MeasurementUnitInclude;

/** A unit row with its localized translations. */
export type MeasurementUnitWithRelations = Prisma.MeasurementUnitGetPayload<{
  include: typeof MEASUREMENT_UNIT_INCLUDE;
}>;

/** Maps a persisted unit row (+ relations) to the shared `MeasurementUnit` contract. */
export function toMeasurementUnit(row: MeasurementUnitWithRelations): MeasurementUnit {
  return {
    id: row.id,
    code: row.code,
    symbol: row.symbol,
    translations: row.translations.map((translation) => ({
      languageCode: translation.languageCode,
      name: translation.name,
      shortLabel: translation.shortLabel,
    })),
  };
}
