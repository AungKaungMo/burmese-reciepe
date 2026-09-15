import { z } from 'zod';

import { languageCodeSchema } from './category.js';
import { paginatedSchema, type Paginated } from './pagination.js';

export const recipeStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);
export type RecipeStatus = z.infer<typeof recipeStatusSchema>;

export const recipeDifficultySchema = z.enum(['EASY', 'MEDIUM', 'HARD']);
export type RecipeDifficulty = z.infer<typeof recipeDifficultySchema>;

export const spiceLevelSchema = z.enum(['NONE', 'MILD', 'MEDIUM', 'HOT']);
export type SpiceLevel = z.infer<typeof spiceLevelSchema>;

export const translationStatusSchema = z.enum(['DRAFT', 'REVIEWED']);
export type TranslationStatus = z.infer<typeof translationStatusSchema>;

/** One row per language in `recipe_translations`. */
export const recipeTranslationSchema = z.object({
  languageCode: languageCodeSchema,
  title: z.string().min(1).max(160),
  summary: z.string().max(300).nullable(),
  overview: z.string().nullable(),
  goodToKnow: z.array(z.string()),
  servingSuggestions: z.array(z.string()),
  searchKeywords: z.array(z.string()),
  status: translationStatusSchema,
});
export type RecipeTranslation = z.infer<typeof recipeTranslationSchema>;

/**
 * A single step's localized text (`recipe_step_translations`). Note `languageCode`
 * here is a free-form code (`VarChar(10)`) in Prisma, not the `LanguageCode` enum.
 */
export const recipeStepTranslationSchema = z.object({
  languageCode: z.string().min(1).max(10),
  instruction: z.string().min(1),
  timerLabel: z.string().nullable(),
  completionCue: z.string().nullable(),
  tip: z.string().nullable(),
  warning: z.string().nullable(),
});
export type RecipeStepTranslation = z.infer<typeof recipeStepTranslationSchema>;

export const recipeStepSchema = z.object({
  id: z.uuid(),
  position: z.number().int().nonnegative(),
  durationSeconds: z.number().int().nonnegative().nullable(),
  translations: z.array(recipeStepTranslationSchema),
});
export type RecipeStep = z.infer<typeof recipeStepSchema>;

/** The `recipes` row plus its `translations`, ordered `steps`, and linked category ids. */
export const recipeSchema = z.object({
  id: z.uuid(),
  slug: z.string().min(1),
  status: recipeStatusSchema,
  cuisineCode: z.string().min(1),
  coverImagePath: z.string().nullable(),
  servings: z.number().int().positive(),
  prepMinutes: z.number().int().nonnegative(),
  cookMinutes: z.number().int().nonnegative(),
  difficulty: recipeDifficultySchema,
  spiceLevel: spiceLevelSchema,
  isFeatured: z.boolean(),
  publishedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  translations: z.array(recipeTranslationSchema),
  categoryIds: z.array(z.uuid()),
  steps: z.array(recipeStepSchema),
});
export type Recipe = z.infer<typeof recipeSchema>;

/** Translation payload for writes — string arrays and `status` fall back to DB defaults. */
export const recipeTranslationInputSchema = z.object({
  languageCode: languageCodeSchema,
  title: z.string().min(1).max(160),
  summary: z.string().max(300).nullable().optional(),
  overview: z.string().nullable().optional(),
  goodToKnow: z.array(z.string()).default([]),
  servingSuggestions: z.array(z.string()).default([]),
  searchKeywords: z.array(z.string()).default([]),
  status: translationStatusSchema.default('DRAFT'),
});
export type RecipeTranslationInput = z.infer<typeof recipeTranslationInputSchema>;

export const recipeStepTranslationInputSchema = z.object({
  languageCode: z.string().min(1).max(10),
  instruction: z.string().min(1),
  timerLabel: z.string().nullable().optional(),
  completionCue: z.string().nullable().optional(),
  tip: z.string().nullable().optional(),
  warning: z.string().nullable().optional(),
});
export type RecipeStepTranslationInput = z.infer<typeof recipeStepTranslationInputSchema>;

export const recipeStepInputSchema = z.object({
  position: z.number().int().nonnegative(),
  durationSeconds: z.number().int().nonnegative().nullable().optional(),
  translations: z.array(recipeStepTranslationInputSchema).min(1),
});
export type RecipeStepInput = z.infer<typeof recipeStepInputSchema>;

/**
 * Payload to create a recipe (`POST /v1/recipes`). Fields with DB defaults may be
 * omitted. At least one translation is required; `categoryIds`/`steps` default empty.
 */
export const createRecipeSchema = z.object({
  slug: z.string().min(1),
  status: recipeStatusSchema.default('DRAFT'),
  cuisineCode: z.string().min(1).default('BURMESE'),
  coverImagePath: z.string().nullable().optional(),
  servings: z.number().int().positive(),
  prepMinutes: z.number().int().nonnegative().default(0),
  cookMinutes: z.number().int().nonnegative().default(0),
  difficulty: recipeDifficultySchema.default('EASY'),
  spiceLevel: spiceLevelSchema.default('MILD'),
  isFeatured: z.boolean().default(false),
  publishedAt: z.iso.datetime().nullable().optional(),
  translations: z.array(recipeTranslationInputSchema).min(1),
  categoryIds: z.array(z.uuid()).default([]),
  steps: z.array(recipeStepInputSchema).default([]),
});
export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;

/**
 * Payload to update a recipe (`PATCH /v1/recipes/:id`). Every field is optional;
 * a supplied `translations`/`steps` array replaces the corresponding set.
 */
export const updateRecipeSchema = createRecipeSchema.partial();
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;

/**
 * Filters for listing recipes (`GET /v1/recipes`). All optional. `isFeatured` is
 * coerced from its query-string form (`"true"`/`"false"`) to a boolean.
 */
export const listRecipesQuerySchema = z.object({
  status: recipeStatusSchema.optional(),
  difficulty: recipeDifficultySchema.optional(),
  cuisineCode: z.string().optional(),
  isFeatured: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
export type ListRecipesQuery = z.infer<typeof listRecipesQuerySchema>;

export const paginatedRecipesSchema = paginatedSchema(recipeSchema);
export type PaginatedRecipes = Paginated<Recipe>;
