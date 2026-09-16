import { z } from 'zod';

import { paginatedSchema, type Paginated } from './pagination.js';

export const measurementUnitTranslationSchema = z.object({
  languageCode: z.string().min(1).max(10),
  name: z.string().min(1).max(100),
  shortLabel: z.string().min(1).max(30),
});
export type MeasurementUnitTranslation = z.infer<typeof measurementUnitTranslationSchema>;

/**
 * A measurement unit (`measurement_units`) plus its localized `translations`. `code`
 * is the stable machine key (e.g. `g`, `ml`); `symbol` is the display glyph (e.g. `g`).
 */
export const measurementUnitSchema = z.object({
  id: z.uuid(),
  code: z.string().min(1).max(30),
  symbol: z.string().min(1).max(20),
  translations: z.array(measurementUnitTranslationSchema),
});
export type MeasurementUnit = z.infer<typeof measurementUnitSchema>;

/**
 * Payload to create a unit (`POST /v1/measurement-units`). At least one translation
 * is required.
 */
export const createMeasurementUnitSchema = z.object({
  code: z.string().min(1).max(30),
  symbol: z.string().min(1).max(20),
  translations: z.array(measurementUnitTranslationSchema).min(1),
});
export type CreateMeasurementUnitInput = z.infer<typeof createMeasurementUnitSchema>;

/**
 * Payload to update a unit (`PATCH /v1/measurement-units/:id`). Every field is optional;
 * a supplied `translations` array replaces the whole set.
 */
export const updateMeasurementUnitSchema = createMeasurementUnitSchema.partial();
export type UpdateMeasurementUnitInput = z.infer<typeof updateMeasurementUnitSchema>;

/**
 * Filters + paging for listing units (`GET /v1/measurement-units`). `search` matches
 * the `code`, `symbol` or any translation `name`; `page`/`pageSize` drive offset paging.
 */
export const listMeasurementUnitsQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
export type ListMeasurementUnitsQuery = z.infer<typeof listMeasurementUnitsQuerySchema>;

/** A paginated page of units, as returned by `GET /v1/measurement-units`. */
export const paginatedMeasurementUnitsSchema = paginatedSchema(measurementUnitSchema);
export type PaginatedMeasurementUnits = Paginated<MeasurementUnit>;
