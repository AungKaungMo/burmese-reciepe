import type { MeasurementUnit } from '@repo/contracts';

import type { MeasurementUnitRow } from '@/features/measurement-units/types';

const PREFERRED_LANGUAGE = 'EN';

/**
 * Picks the display translation (English first, else the first available) and
 * flattens the contract shape into the row the table renders.
 */
export function toMeasurementUnitRow(unit: MeasurementUnit): MeasurementUnitRow {
  const translation =
    unit.translations.find((t) => t.languageCode === PREFERRED_LANGUAGE) ?? unit.translations[0];

  return {
    id: unit.id,
    code: unit.code,
    symbol: unit.symbol,
    name: translation?.name ?? unit.code,
    shortLabel: translation?.shortLabel ?? unit.symbol,
  };
}
