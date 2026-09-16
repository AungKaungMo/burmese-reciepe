import type { Nutrient } from '@repo/contracts';

import type { NutrientRow } from '@/features/nutrients/types';

const PREFERRED_LANGUAGE = 'EN';

/**
 * Picks the display translation (English first, else the first available) and
 * flattens the contract shape into the row the table renders. `unitById` maps a
 * measurement-unit id to its symbol so the table can show the unit, not the id.
 */
export function toNutrientRow(nutrient: Nutrient, unitById: Map<string, string>): NutrientRow {
  const translation =
    nutrient.translations.find((t) => t.languageCode === PREFERRED_LANGUAGE) ??
    nutrient.translations[0];

  return {
    id: nutrient.id,
    code: nutrient.code,
    name: translation?.name ?? nutrient.code,
    description: translation?.description ?? '',
    unit: unitById.get(nutrient.defaultUnitId) ?? '—',
    icon: nutrient.iconPath,
  };
}
