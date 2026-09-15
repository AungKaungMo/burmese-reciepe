import { z } from 'zod';

import { languageCodeSchema } from './category.js';
import { paginatedSchema, type Paginated } from './pagination.js';

/**
 * One row per language in `ingredient_substitution_translations`. Both fields are
 * optional notes shown to users about how/why to use the substitute.
 */
export const ingredientSubstitutionTranslationSchema = z.object({
  languageCode: languageCodeSchema,
  usageInstruction: z.string().nullable(),
  effectNote: z.string().nullable(),
});
export type IngredientSubstitutionTranslation = z.infer<
  typeof ingredientSubstitutionTranslationSchema
>;

/**
 * A directed "use B in place of A" swap (`ingredient_substitutions`) with optional
 * conversion amounts/units and localized notes. `priority` orders alternatives for
 * the same original ingredient (lower first). Timestamps are ISO 8601 UTC.
 */
export const ingredientSubstitutionSchema = z.object({
  id: z.uuid(),
  originalIngredientId: z.uuid(),
  substituteIngredientId: z.uuid(),
  originalAmount: z.number().nullable(),
  originalUnitCode: z.string().max(30).nullable(),
  substituteAmount: z.number().nullable(),
  substituteUnitCode: z.string().max(30).nullable(),
  priority: z.number().int().nonnegative(),
  isActive: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  translations: z.array(ingredientSubstitutionTranslationSchema),
});
export type IngredientSubstitution = z.infer<typeof ingredientSubstitutionSchema>;

/** Translation payload for writes — optional notes fall back to `null`. */
export const ingredientSubstitutionTranslationInputSchema = z.object({
  languageCode: languageCodeSchema,
  usageInstruction: z.string().nullable().optional(),
  effectNote: z.string().nullable().optional(),
});
export type IngredientSubstitutionTranslationInput = z.infer<
  typeof ingredientSubstitutionTranslationInputSchema
>;

/**
 * Payload to create a substitution (`POST /v1/ingredient-substitutions`). Amounts/units
 * and translations are optional; `priority`/`isActive` fall back to their DB defaults.
 */
export const createIngredientSubstitutionSchema = z.object({
  originalIngredientId: z.uuid(),
  substituteIngredientId: z.uuid(),
  originalAmount: z.number().nonnegative().nullable().optional(),
  originalUnitCode: z.string().max(30).nullable().optional(),
  substituteAmount: z.number().nonnegative().nullable().optional(),
  substituteUnitCode: z.string().max(30).nullable().optional(),
  priority: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
  translations: z.array(ingredientSubstitutionTranslationInputSchema).default([]),
});
export type CreateIngredientSubstitutionInput = z.infer<
  typeof createIngredientSubstitutionSchema
>;

/**
 * Payload to update a substitution (`PATCH /v1/ingredient-substitutions/:id`). Every
 * field is optional; a supplied `translations` array replaces the whole set.
 */
export const updateIngredientSubstitutionSchema =
  createIngredientSubstitutionSchema.partial();
export type UpdateIngredientSubstitutionInput = z.infer<
  typeof updateIngredientSubstitutionSchema
>;

/**
 * Filters + paging for listing substitutions (`GET /v1/ingredient-substitutions`).
 * `isActive` is coerced from its query-string form (`"true"`/`"false"`);
 * `page`/`pageSize` drive offset pagination.
 */
export const listIngredientSubstitutionsQuerySchema = z.object({
  originalIngredientId: z.uuid().optional(),
  substituteIngredientId: z.uuid().optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
export type ListIngredientSubstitutionsQuery = z.infer<
  typeof listIngredientSubstitutionsQuerySchema
>;

/** A paginated page of substitutions, as returned by `GET /v1/ingredient-substitutions`. */
export const paginatedIngredientSubstitutionsSchema = paginatedSchema(
  ingredientSubstitutionSchema,
);
export type PaginatedIngredientSubstitutions = Paginated<IngredientSubstitution>;
