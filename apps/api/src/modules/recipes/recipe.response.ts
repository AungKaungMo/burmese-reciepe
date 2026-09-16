import type { Recipe } from '@repo/contracts';
import { Prisma } from '../../generated/prisma/client.js';

/** Prisma include used everywhere a full recipe is loaded. */
export const RECIPE_INCLUDE = {
  translations: true,
  categoryLinks: true,
  recipeSteps: { include: { translations: true }, orderBy: { position: 'asc' } },
  recipeIngredients: { include: { translations: true }, orderBy: { position: 'asc' } },
} satisfies Prisma.RecipeInclude;

/** A recipe row with translations, category links and ordered steps (+ their translations). */
export type RecipeWithRelations = Prisma.RecipeGetPayload<{ include: typeof RECIPE_INCLUDE }>;

/** Maps a persisted recipe row (+ relations) to the shared `Recipe` contract. */
export function toRecipe(row: RecipeWithRelations): Recipe {
  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    cuisineCode: row.cuisineCode,
    coverImagePath: row.coverImagePath,
    servings: row.servings,
    prepMinutes: row.prepMinutes,
    cookMinutes: row.cookMinutes,
    difficulty: row.difficulty,
    spiceLevel: row.spiceLevel,
    isFeatured: row.isFeatured,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    translations: row.translations.map((translation) => ({
      languageCode: translation.languageCode,
      title: translation.title,
      summary: translation.summary,
      overview: translation.overview,
      goodToKnow: translation.goodToKnow,
      servingSuggestions: translation.servingSuggestions,
      searchKeywords: translation.searchKeywords,
      status: translation.status,
    })),
    categoryIds: row.categoryLinks.map((link) => link.categoryId),
    steps: row.recipeSteps.map((step) => ({
      id: step.id,
      position: step.position,
      durationSeconds: step.durationSeconds,
      translations: step.translations.map((translation) => ({
        languageCode: translation.languageCode,
        instruction: translation.instruction,
        timerLabel: translation.timerLabel,
        completionCue: translation.completionCue,
        tip: translation.tip,
        warning: translation.warning,
      })),
    })),
    recipeIngredients: row.recipeIngredients.map((ingredient) => ({
      id: ingredient.id,
      ingredientId: ingredient.ingredientId,
      unitId: ingredient.unitId,
      // Prisma returns `Decimal` for numeric columns; the contract exposes plain numbers.
      quantity: ingredient.quantity == null ? null : Number(ingredient.quantity),
      position: ingredient.position,
      isOptional: ingredient.isOptional,
      translations: ingredient.translations.map((translation) => ({
        languageCode: translation.languageCode,
        preparationNote: translation.preparationNote,
        amountNote: translation.amountNote,
      })),
    })),
  };
}
