import { z } from 'zod';

/** One failed row from an xlsx import, reported so the user can fix and retry. */
export const importErrorSchema = z.object({
  // 1-based row number in the sheet (matches what the user sees, header excluded).
  row: z.number().int(),
  // A human-friendly row identifier (e.g. the `code`/`slug`), when available.
  code: z.string().nullable(),
  message: z.string(),
});
export type ImportError = z.infer<typeof importErrorSchema>;

/** Outcome of an xlsx bulk import. Partial success is allowed — bad rows are collected. */
export const importResultSchema = z.object({
  total: z.number().int().nonnegative(),
  created: z.number().int().nonnegative(),
  failed: z.number().int().nonnegative(),
  errors: z.array(importErrorSchema),
});
export type ImportResult = z.infer<typeof importResultSchema>;
