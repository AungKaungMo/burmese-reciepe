import {
  nutrientSchema,
  paginatedNutrientsSchema,
  type CreateNutrientInput,
  type ListNutrientsQuery,
  type Nutrient,
  type PaginatedNutrients,
  type UpdateNutrientInput,
} from '@repo/contracts';

import { api } from '@/shared/lib/api';

export async function fetchNutrients(query: ListNutrientsQuery): Promise<PaginatedNutrients> {
  const { data } = await api.get('/v1/nutrients', { params: query });
  return paginatedNutrientsSchema.parse(data);
}

export async function fetchNutrient(id: string): Promise<Nutrient> {
  const { data } = await api.get(`/v1/nutrients/${id}`);
  return nutrientSchema.parse(data);
}

export async function createNutrient(input: CreateNutrientInput): Promise<Nutrient> {
  const { data } = await api.post('/v1/nutrients', input);
  return nutrientSchema.parse(data);
}

export async function updateNutrient(
  id: string,
  input: UpdateNutrientInput,
): Promise<Nutrient> {
  const { data } = await api.patch(`/v1/nutrients/${id}`, input);
  return nutrientSchema.parse(data);
}

export async function deleteNutrient(id: string): Promise<void> {
  await api.delete(`/v1/nutrients/${id}`);
}
