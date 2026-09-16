import { z } from 'zod';

import { paginatedSchema, type Paginated } from './pagination.js';

/**
 * One row per language in `nutrient_translations`. `name` is required; `description`
 * is optional. Note `languageCode` here is a free-form code (`VarChar(10)`), not the
 * `LanguageCode` enum.
 */
export const nutrientTranslationSchema = z.object({
  languageCode: z.string().min(1).max(10),
  name: z.string().min(1).max(100),
  description: z.string().nullable(),
});
export type NutrientTranslation = z.infer<typeof nutrientTranslationSchema>;

/**
 * A nutrient (`nutrients`) plus its localized `translations`. `code` is the stable
 * machine key (e.g. `PROTEIN`); `defaultUnitId` references the unit its amounts are
 * measured in (e.g. grams).
 */
export const nutrientSchema = z.object({
  id: z.uuid(),
  code: z.string().min(1).max(50),
  defaultUnitId: z.uuid(),
  iconPath: z.string().nullable(),
  translations: z.array(nutrientTranslationSchema),
});
export type Nutrient = z.infer<typeof nutrientSchema>;

/** Translation payload for writes — `description` falls back to `null`. */
export const nutrientTranslationInputSchema = z.object({
  languageCode: z.string().min(1).max(10),
  name: z.string().min(1).max(100),
  description: z.string().nullable().optional(),
});
export type NutrientTranslationInput = z.infer<typeof nutrientTranslationInputSchema>;

/**
 * Payload to create a nutrient (`POST /v1/nutrients`). `iconPath` is optional; at
 * least one translation is required.
 */
export const createNutrientSchema = z.object({
  code: z.string().min(1).max(50),
  defaultUnitId: z.uuid(),
  iconPath: z.string().nullable().optional(),
  translations: z.array(nutrientTranslationInputSchema).min(1),
});
export type CreateNutrientInput = z.infer<typeof createNutrientSchema>;

/**
 * Payload to update a nutrient (`PATCH /v1/nutrients/:id`). Every field is optional;
 * a supplied `translations` array replaces the whole set.
 */
export const updateNutrientSchema = createNutrientSchema.partial();
export type UpdateNutrientInput = z.infer<typeof updateNutrientSchema>;

/**
 * Filters + paging for listing nutrients (`GET /v1/nutrients`). `search` matches the
 * `code` or any translation `name`; `page`/`pageSize` drive offset pagination.
 */
export const listNutrientsQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
export type ListNutrientsQuery = z.infer<typeof listNutrientsQuerySchema>;

/** A paginated page of nutrients, as returned by `GET /v1/nutrients`. */
export const paginatedNutrientsSchema = paginatedSchema(nutrientSchema);
export type PaginatedNutrients = Paginated<Nutrient>;
