import { emptyToNull, normalizeRow, parseBoolean } from '../../common/import-cell.js';

/**
 * Maps one spreadsheet row to a candidate category payload. The result is NOT yet
 * validated — the caller runs it through `createCategorySchema`, which surfaces bad
 * scopes, missing codes, empty translations, non-numeric sortOrder, etc. as errors.
 */
export function rowToCategoryInput(raw: Record<string, unknown>): unknown {
  const row = normalizeRow(raw);

  const translations: { languageCode: string; name: string; description: string | null }[] = [];
  if (row.name_my) {
    translations.push({ languageCode: 'MY', name: row.name_my, description: emptyToNull(row.description_my) });
  }
  if (row.name_en) {
    translations.push({ languageCode: 'EN', name: row.name_en, description: emptyToNull(row.description_en) });
  }

  return {
    scope: row.scope ? row.scope.toUpperCase() : 'RECIPE',
    code: row.code,
    // Empty → schema default (0); a non-numeric cell becomes NaN so the schema rejects it.
    sortOrder: row.sortorder ? Number(row.sortorder) : 0,
    isActive: parseBoolean(row.isactive, true),
    translations,
  };
}
