import {
  emptyToNull,
  normalizeRow,
  parseBoolean,
  toOptionalNumber,
} from '../../common/import-cell.js';

/**
 * Maps one spreadsheet row to a candidate recipe payload — core fields + MY/EN
 * translations only. Steps and category links aren't part of the flat import; add
 * them later via the edit form. Enum/number cells left blank fall back to the
 * schema defaults; invalid values are rejected by `createRecipeSchema`.
 */
export function rowToRecipeInput(raw: Record<string, unknown>): unknown {
  const row = normalizeRow(raw);

  const translations: { languageCode: string; title: string; summary: string | null; overview: string | null }[] =
    [];
  if (row.title_my) {
    translations.push({
      languageCode: 'MY',
      title: row.title_my,
      summary: emptyToNull(row.summary_my),
      overview: emptyToNull(row.overview_my),
    });
  }
  if (row.title_en) {
    translations.push({
      languageCode: 'EN',
      title: row.title_en,
      summary: emptyToNull(row.summary_en),
      overview: emptyToNull(row.overview_en),
    });
  }

  return {
    slug: row.slug,
    status: row.status ? row.status.toUpperCase() : undefined,
    cuisineCode: row.cuisinecode || undefined,
    difficulty: row.difficulty ? row.difficulty.toUpperCase() : undefined,
    spiceLevel: row.spicelevel ? row.spicelevel.toUpperCase() : undefined,
    servings: toOptionalNumber(row.servings),
    prepMinutes: toOptionalNumber(row.prepminutes),
    cookMinutes: toOptionalNumber(row.cookminutes),
    isFeatured: parseBoolean(row.isfeatured, false),
    translations,
    categoryIds: [],
    steps: [],
  };
}
