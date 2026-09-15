import {
  recipeDifficultySchema,
  recipeStatusSchema,
  spiceLevelSchema,
  type RecipeDifficulty,
  type RecipeStatus,
  type SpiceLevel,
} from '@repo/contracts';

// Display labels for the recipe enums. Values come from the contract; only these
// UI strings are admin-owned. Typed against the enum so a new value forces an update.
export const RECIPE_STATUS_LABELS: Record<RecipeStatus, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
};

export const RECIPE_DIFFICULTY_LABELS: Record<RecipeDifficulty, string> = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
};

export const SPICE_LEVEL_LABELS: Record<SpiceLevel, string> = {
  NONE: 'None',
  MILD: 'Mild',
  MEDIUM: 'Medium',
  HOT: 'Hot',
};

export type SelectOption<T extends string> = { value: T; label: string };

const toOptions = <T extends string>(
  values: readonly T[],
  labels: Record<T, string>,
): SelectOption<T>[] => values.map((value) => ({ value, label: labels[value] }));

export const RECIPE_STATUS_OPTIONS = toOptions(recipeStatusSchema.options, RECIPE_STATUS_LABELS);
export const RECIPE_DIFFICULTY_OPTIONS = toOptions(
  recipeDifficultySchema.options,
  RECIPE_DIFFICULTY_LABELS,
);
export const SPICE_LEVEL_OPTIONS = toOptions(spiceLevelSchema.options, SPICE_LEVEL_LABELS);
