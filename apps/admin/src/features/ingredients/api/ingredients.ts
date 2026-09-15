import {
  importResultSchema,
  ingredientSchema,
  paginatedIngredientsSchema,
  type CreateIngredientInput,
  type ImportResult,
  type Ingredient,
  type ListIngredientsQuery,
  type PaginatedIngredients,
  type UpdateIngredientInput,
} from '@repo/contracts';

import { api } from '@/shared/lib/api';

export async function fetchIngredients(
  query: ListIngredientsQuery,
): Promise<PaginatedIngredients> {
  const { data } = await api.get('/v1/ingredients', { params: query });
  return paginatedIngredientsSchema.parse(data);
}

export async function fetchIngredient(id: string): Promise<Ingredient> {
  const { data } = await api.get(`/v1/ingredients/${id}`);
  return ingredientSchema.parse(data);
}

export async function createIngredient(input: CreateIngredientInput): Promise<Ingredient> {
  const { data } = await api.post('/v1/ingredients', input);
  return ingredientSchema.parse(data);
}

export async function updateIngredient(
  id: string,
  input: UpdateIngredientInput,
): Promise<Ingredient> {
  const { data } = await api.patch(`/v1/ingredients/${id}`, input);
  return ingredientSchema.parse(data);
}

export async function deleteIngredient(id: string): Promise<void> {
  await api.delete(`/v1/ingredients/${id}`);
}

/** Uploads an xlsx file to bulk-create ingredients; returns the per-row outcome. */
export async function importIngredients(file: File): Promise<ImportResult> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/v1/ingredients/import', formData);
  return importResultSchema.parse(data);
}
