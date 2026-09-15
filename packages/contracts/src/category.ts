import { z } from 'zod';

import { paginatedSchema, type Paginated } from './pagination.js';

export const categoryScopeSchema = z.enum(['INGREDIENT', 'RECIPE']);
export type CategoryScope = z.infer<typeof categoryScopeSchema>;

export const languageCodeSchema = z.enum(['MY', 'EN', 'JP']);
export type LanguageCode = z.infer<typeof languageCodeSchema>;

/** One row per language in `category_translations`. */
export const categoryTranslationSchema = z.object({
  languageCode: languageCodeSchema,
  name: z.string().min(1).max(100),
  description: z.string().max(2000).nullable(),
});

export type CategoryTranslation = z.infer<typeof categoryTranslationSchema>;

/** The `categories` row plus its localized `translations`. */
export const categorySchema = z.object({
  id: z.uuid(),
  scope: categoryScopeSchema,
  /** Stable machine key, unique per `scope`. */
  code: z.string().min(1).max(100),
  iconPath: z.string().nullable(),
  sortOrder: z.number().int().nonnegative(),
  isActive: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  translations: z.array(categoryTranslationSchema),
});

export type Category = z.infer<typeof categorySchema>;

/**
 * Payload to create a category (`POST /v1/categories`). `sortOrder`/`isActive` fall
 * back to their DB defaults when omitted. At least one translation is required.
 */
export const createCategorySchema = z.object({
  scope: categoryScopeSchema,
  code: z.string().min(1).max(100),
  iconPath: z.string().nullable().optional(),
  sortOrder: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
  translations: z.array(categoryTranslationSchema).min(1),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

/**
 * Payload to update a category (`PATCH /v1/categories/:id`). Every field is optional;
 * only the provided keys are changed. A supplied `translations` array replaces the set.
 */
export const updateCategorySchema = createCategorySchema.partial();

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

/**
 * Filters + paging for listing categories (`GET /v1/categories`). `isActive` is
 * coerced from its query-string form (`"true"`/`"false"`); `search` matches the
 * `code` or any translation `name`; `page`/`pageSize` drive offset pagination.
 */
export const listCategoriesQuerySchema = z.object({
  scope: categoryScopeSchema.optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export type ListCategoriesQuery = z.infer<typeof listCategoriesQuerySchema>;

export const paginatedCategoriesSchema = paginatedSchema(categorySchema);
export type PaginatedCategories = Paginated<Category>;
