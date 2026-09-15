import { emptyToNull, normalizeRow, parseBoolean, toList } from '../../common/import-cell.js';

export function makeRowToIngredientInput(categoryIdByCode: Map<string, string>) {
  return function rowToIngredientInput(raw: Record<string, unknown>): unknown {
    const row = normalizeRow(raw);

    const translations: { languageCode: string; name: string; aliases: string[] }[] = [];
    if (row.name_my) {
      translations.push({ languageCode: 'MY', name: row.name_my, aliases: toList(row.aliases_my) });
    }
    if (row.name_en) {
      translations.push({ languageCode: 'EN', name: row.name_en, aliases: toList(row.aliases_en) });
    }

    const categoryCode = row.category_code.toLowerCase();

    return {
      code: row.code,
      categoryId: categoryCode ? (categoryIdByCode.get(categoryCode) ?? '') : '',
      emoji: emptyToNull(row.emoji),
      isActive: parseBoolean(row.isactive, true),
      translations,
    };
  };
}
