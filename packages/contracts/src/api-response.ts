import { z } from 'zod';

/**
 * The envelope every API endpoint returns. Successful responses carry `data`;
 * the HTTP status is echoed in `code` so clients can branch without inspecting
 * transport internals.
 */
export type ApiSuccess<T> = {
  success: true;
  code: number;
  data: T;
};

/** A single field-level validation problem (e.g. from Zod). */
export const apiFieldErrorSchema = z.object({
  path: z.string(),
  message: z.string(),
});
export type ApiFieldError = z.infer<typeof apiFieldErrorSchema>;

/** The envelope returned for any failed request. */
export const apiErrorSchema = z.object({
  success: z.literal(false),
  code: z.number().int(),
  message: z.string(),
  errors: z.array(apiFieldErrorSchema).optional(),
});
export type ApiError = z.infer<typeof apiErrorSchema>;

/** Builds a success-envelope schema around a given `data` schema. */
export function apiSuccessSchema<T extends z.ZodType>(data: T) {
  return z.object({
    success: z.literal(true),
    code: z.number().int(),
    data,
  });
}
