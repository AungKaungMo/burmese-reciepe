import {
  importResultSchema,
  paginatedRecipesSchema,
  recipeSchema,
  type CreateRecipeInput,
  type ImportResult,
  type ListRecipesQuery,
  type PaginatedRecipes,
  type Recipe,
  type UpdateRecipeInput,
} from '@repo/contracts';

import { api } from '@/shared/lib/api';

/** Default page for list calls that don't paginate yet (matches the contract's defaults). */
const DEFAULT_RECIPES_QUERY: ListRecipesQuery = { page: 1, pageSize: 20 };

/** `GET /v1/recipes` — filtered by status/difficulty/cuisine/featured/search, paginated. */
export async function fetchRecipes(
  query: ListRecipesQuery = DEFAULT_RECIPES_QUERY,
): Promise<PaginatedRecipes> {
  const { data } = await api.get('/v1/recipes', { params: query });
  return paginatedRecipesSchema.parse(data);
}

export async function fetchRecipe(id: string): Promise<Recipe> {
  const { data } = await api.get(`/v1/recipes/${id}`);
  return recipeSchema.parse(data);
}

export async function createRecipe(input: CreateRecipeInput): Promise<Recipe> {
  const { data } = await api.post('/v1/recipes', input);
  return recipeSchema.parse(data);
}

export async function updateRecipe(
  id: string,
  input: UpdateRecipeInput,
): Promise<Recipe> {
  const { data } = await api.patch(`/v1/recipes/${id}`, input);
  return recipeSchema.parse(data);
}

export async function deleteRecipe(id: string): Promise<void> {
  await api.delete(`/v1/recipes/${id}`);
}

/** Uploads an xlsx file to bulk-create recipes; returns the per-row outcome. */
export async function importRecipes(file: File): Promise<ImportResult> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/v1/recipes/import', formData);
  return importResultSchema.parse(data);
}
