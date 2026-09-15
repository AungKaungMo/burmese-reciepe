import type { LanguageCode, Recipe, RecipeStatus } from '@repo/contracts';

/** Flattened, table-friendly view of a contract `Recipe`. */
export type RecipeRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  status: RecipeStatus;
  difficulty: Recipe['difficulty'];
  servings: number;
  totalMinutes: number;
  isFeatured: boolean;
  image: string | null;
};

const PREFERRED_LANGUAGE: LanguageCode = 'EN';

/**
 * Picks the display translation (English first, else the first available) and
 * flattens the contract shape into the row the table renders.
 */
export function toRecipeRow(recipe: Recipe): RecipeRow {
  const translation =
    recipe.translations.find((t) => t.languageCode === PREFERRED_LANGUAGE) ??
    recipe.translations[0];

  return {
    id: recipe.id,
    slug: recipe.slug,
    title: translation?.title ?? recipe.slug,
    summary: translation?.summary ?? '',
    status: recipe.status,
    difficulty: recipe.difficulty,
    servings: recipe.servings,
    totalMinutes: recipe.prepMinutes + recipe.cookMinutes,
    isFeatured: recipe.isFeatured,
    image: recipe.coverImagePath,
  };
}
