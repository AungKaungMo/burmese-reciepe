import {
  ingredientSubstitutionSchema,
  paginatedIngredientSubstitutionsSchema,
  type CreateIngredientSubstitutionInput,
  type IngredientSubstitution,
  type ListIngredientSubstitutionsQuery,
  type PaginatedIngredientSubstitutions,
  type UpdateIngredientSubstitutionInput,
} from '@repo/contracts';

import { api } from '@/shared/lib/api';

/** `GET /v1/ingredient-substitutions` — filtered by original/substitute/active, paginated. */
export async function fetchSubstitutions(
  query: ListIngredientSubstitutionsQuery,
): Promise<PaginatedIngredientSubstitutions> {
  const { data } = await api.get('/v1/ingredient-substitutions', { params: query });
  return paginatedIngredientSubstitutionsSchema.parse(data);
}

export async function createSubstitution(
  input: CreateIngredientSubstitutionInput,
): Promise<IngredientSubstitution> {
  const { data } = await api.post('/v1/ingredient-substitutions', input);
  return ingredientSubstitutionSchema.parse(data);
}

export async function updateSubstitution(
  id: string,
  input: UpdateIngredientSubstitutionInput,
): Promise<IngredientSubstitution> {
  const { data } = await api.patch(`/v1/ingredient-substitutions/${id}`, input);
  return ingredientSubstitutionSchema.parse(data);
}

export async function deleteSubstitution(id: string): Promise<void> {
  await api.delete(`/v1/ingredient-substitutions/${id}`);
}
