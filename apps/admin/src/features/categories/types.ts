import type { Category, LanguageCode } from '@repo/contracts';

/** Flattened, table-friendly view of a contract `Category`. */
export type CategoryRow = {
  id: string;
  code: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  image: string | null;
};

const PREFERRED_LANGUAGE: LanguageCode = 'EN';

/**
 * Picks the display translation (English first, else the first available) and
 * flattens the contract shape into the row the table renders.
 */
export function toCategoryRow(category: Category): CategoryRow {
  const translation =
    category.translations.find((t) => t.languageCode === PREFERRED_LANGUAGE) ??
    category.translations[0];

  return {
    id: category.id,
    code: category.code,
    name: translation?.name ?? category.code,
    description: translation?.description ?? '',
    status: category.isActive ? 'active' : 'inactive',
    image: category.iconPath,
  };
}
