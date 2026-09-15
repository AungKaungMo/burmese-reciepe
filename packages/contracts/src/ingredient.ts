import { z } from 'zod';

import { languageCodeSchema } from './category.js';
import { paginatedSchema, type Paginated } from './pagination.js';

/**
 * One row per language in `ingredient_translations`. `name` is required per language;
 * `aliases` (alternate spellings/synonyms used for search) defaults to empty.
 */
export const ingredientTranslationSchema = z.object({
  languageCode: languageCodeSchema,
  name: z.string().min(1).max(120),
  aliases: z.array(z.string()),
});
export type IngredientTranslation = z.infer<typeof ingredientTranslationSchema>;

/**
 * The `ingredients` row plus its localized `translations`. Belongs to a `category`
 * (scope `INGREDIENT`) and optionally references a default `MeasurementUnit`.
 * Timestamps are ISO 8601 UTC.
 */
export const ingredientSchema = z.object({
  id: z.uuid(),
  /** Stable machine key, globally unique. */
  code: z.string().min(1).max(100),
  categoryId: z.uuid(),
  defaultUnitId: z.uuid().nullable(),
  emoji: z.string().nullable(),
  iconPath: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  translations: z.array(ingredientTranslationSchema),
});
export type Ingredient = z.infer<typeof ingredientSchema>;

/** Translation payload for writes — `aliases` falls back to an empty array. */
export const ingredientTranslationInputSchema = z.object({
  languageCode: languageCodeSchema,
  name: z.string().min(1).max(120),
  aliases: z.array(z.string()).default([]),
});
export type IngredientTranslationInput = z.infer<typeof ingredientTranslationInputSchema>;

/**
 * Payload to create an ingredient (`POST /v1/ingredients`). Optional fields fall back
 * to their DB defaults/null. At least one translation is required.
 */
export const createIngredientSchema = z.object({
  code: z.string().min(1).max(100),
  categoryId: z.uuid(),
  defaultUnitId: z.uuid().nullable().optional(),
  emoji: z.string().nullable().optional(),
  iconPath: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  translations: z.array(ingredientTranslationInputSchema).min(1),
});
export type CreateIngredientInput = z.infer<typeof createIngredientSchema>;

/**
 * Payload to update an ingredient (`PATCH /v1/ingredients/:id`). Every field is optional;
 * only supplied keys change. A supplied `translations` array replaces the whole set.
 */
export const updateIngredientSchema = createIngredientSchema.partial();
export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>;

/**
 * Filters + paging for listing ingredients (`GET /v1/ingredients`). `isActive` is
 * coerced from its query-string form (`"true"`/`"false"`); `search` matches the
 * `code` or any translation `name`; `page`/`pageSize` drive offset pagination.
 */
export const listIngredientsQuerySchema = z.object({
  categoryId: z.uuid().optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
export type ListIngredientsQuery = z.infer<typeof listIngredientsQuerySchema>;

/** A paginated page of ingredients, as returned by `GET /v1/ingredients`. */
export const paginatedIngredientsSchema = paginatedSchema(ingredientSchema);
export type PaginatedIngredients = Paginated<Ingredient>;
