import type { Nutrient } from '@repo/contracts';
import { Prisma } from '../../generated/prisma/client.js';

/** Prisma include used everywhere a full nutrient is loaded. */
export const NUTRIENT_INCLUDE = {
  translations: true,
} satisfies Prisma.NutrientInclude;

/** A nutrient row with its localized translations. */
export type NutrientWithRelations = Prisma.NutrientGetPayload<{
  include: typeof NUTRIENT_INCLUDE;
}>;

/** Maps a persisted nutrient row (+ relations) to the shared `Nutrient` contract. */
export function toNutrient(row: NutrientWithRelations): Nutrient {
  return {
    id: row.id,
    code: row.code,
    defaultUnitId: row.defaultUnitId,
    iconPath: row.iconPath,
    translations: row.translations.map((translation) => ({
      languageCode: translation.languageCode,
      name: translation.name,
      description: translation.description,
    })),
  };
}
