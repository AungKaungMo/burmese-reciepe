import {
  categorySchema,
  importResultSchema,
  paginatedCategoriesSchema,
  type Category,
  type CreateCategoryInput,
  type ImportResult,
  type ListCategoriesQuery,
  type PaginatedCategories,
  type UpdateCategoryInput,
} from '@repo/contracts';

import { api } from '@/shared/lib/api';

/** `GET /v1/categories` — filtered by `scope`/`isActive`/`search`, paginated. */
export async function fetchCategories(
  query: ListCategoriesQuery,
): Promise<PaginatedCategories> {
  const { data } = await api.get('/v1/categories', { params: query });
  return paginatedCategoriesSchema.parse(data);
}

export async function fetchCategory(id: string): Promise<Category> {
  const { data } = await api.get(`/v1/categories/${id}`);
  return categorySchema.parse(data);
}

export async function createCategory(
  input: CreateCategoryInput,
): Promise<Category> {
  const { data } = await api.post('/v1/categories', input);
  return categorySchema.parse(data);
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput,
): Promise<Category> {
  const { data } = await api.patch(`/v1/categories/${id}`, input);
  return categorySchema.parse(data);
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/v1/categories/${id}`);
}

/** Uploads an xlsx file to bulk-create categories; returns the per-row outcome. */
export async function importCategories(file: File): Promise<ImportResult> {
  const formData = new FormData();
  formData.append('file', file);
  // Let the browser set the multipart boundary; the `api` interceptor adds the bearer.
  const { data } = await api.post('/v1/categories/import', formData);
  return importResultSchema.parse(data);
}
