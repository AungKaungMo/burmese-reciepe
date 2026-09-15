import { z, type ZodType } from 'zod';

/**
 * Reusable offset-pagination query params. `page` is 1-based; both are coerced
 * from their query-string form and fall back to sensible defaults.
 */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

/** Wraps an item schema in the standard paginated-list envelope. */
export function paginatedSchema<T extends ZodType>(item: T) {
  return z.object({
    items: z.array(item),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
  });
}

/** A page of results plus the counts needed to render pagination controls. */
export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
