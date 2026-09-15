import type { IngredientSubstitution } from '@repo/contracts';
import { Prisma } from '../../generated/prisma/client.js';

/** Prisma include used everywhere a full substitution is loaded. */
export const INGREDIENT_SUBSTITUTION_INCLUDE = {
  translations: true,
} satisfies Prisma.IngredientSubstitutionInclude;

/** A substitution row with its localized translations. */
export type IngredientSubstitutionWithRelations = Prisma.IngredientSubstitutionGetPayload<{
  include: typeof INGREDIENT_SUBSTITUTION_INCLUDE;
}>;

/** Maps a persisted substitution row (+ relations) to the shared contract. */
export function toIngredientSubstitution(
  row: IngredientSubstitutionWithRelations,
): IngredientSubstitution {
  return {
    id: row.id,
    originalIngredientId: row.originalIngredientId,
    substituteIngredientId: row.substituteIngredientId,
    // Prisma returns `Decimal` for numeric columns; the contract exposes plain numbers.
    originalAmount: row.originalAmount == null ? null : Number(row.originalAmount),
    originalUnitCode: row.originalUnitCode,
    substituteAmount: row.substituteAmount == null ? null : Number(row.substituteAmount),
    substituteUnitCode: row.substituteUnitCode,
    priority: row.priority,
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    translations: row.translations.map((translation) => ({
      languageCode: translation.languageCode,
      usageInstruction: translation.usageInstruction,
      effectNote: translation.effectNote,
    })),
  };
}
