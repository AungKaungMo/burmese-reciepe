import type { Ingredient } from '@repo/contracts';
import { Prisma } from '../../generated/prisma/client.js';

/** Prisma include used everywhere a full ingredient is loaded. */
export const INGREDIENT_INCLUDE = {
  translations: true,
} satisfies Prisma.IngredientInclude;

/** An ingredient row with its localized translations. */
export type IngredientWithRelations = Prisma.IngredientGetPayload<{
  include: typeof INGREDIENT_INCLUDE;
}>;

export function toIngredient(row: IngredientWithRelations): Ingredient {
  return {
    id: row.id,
    code: row.code,
    categoryId: row.categoryId,
    defaultUnitId: row.defaultUnitId,
    emoji: row.emoji,
    iconPath: row.iconPath,
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    translations: row.translations.map((translation) => ({
      languageCode: translation.languageCode,
      name: translation.name,
      aliases: translation.aliases,
    })),
  };
}
