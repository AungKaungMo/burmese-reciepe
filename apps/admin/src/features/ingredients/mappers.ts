import type { Ingredient, LanguageCode } from '@repo/contracts';

import type { IngredientRow } from '@/features/ingredients/types';

const PREFERRED_LANGUAGE: LanguageCode = 'EN';

/**
 * Picks the display translation (English first, else the first available) and
 * flattens the contract shape into the row the table renders.
 */
export function toIngredientRow(ingredient: Ingredient): IngredientRow {
  const translation =
    ingredient.translations.find((t) => t.languageCode === PREFERRED_LANGUAGE) ??
    ingredient.translations[0];

  return {
    id: ingredient.id,
    code: ingredient.code,
    name: translation?.name ?? ingredient.code,
    aliases: translation?.aliases.join(', ') ?? '',
    status: ingredient.isActive ? 'active' : 'inactive',
    emoji: ingredient.emoji,
    icon: ingredient.iconPath,
  };
}
