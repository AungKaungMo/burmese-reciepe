import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type {
  CreateNutrientInput,
  ListNutrientsQuery,
  UpdateNutrientInput,
} from '@repo/contracts';

import {
  createNutrient,
  deleteNutrient,
  fetchNutrient,
  fetchNutrients,
  updateNutrient,
} from './nutrients';

export const nutrientKeys = {
  all: ['nutrients'] as const,
  list: (query: ListNutrientsQuery) => ['nutrients', 'list', query] as const,
  detail: (id: string) => ['nutrients', 'detail', id] as const,
};

/** The `api` interceptor collapses error envelopes to `Error`, so use its message. */
function toastError(fallback: string) {
  return (error: unknown) => toast.error(error instanceof Error ? error.message : fallback);
}

export function useNutrients(query: ListNutrientsQuery) {
  return useQuery({
    queryKey: nutrientKeys.list(query),
    queryFn: () => fetchNutrients(query),
    placeholderData: keepPreviousData,
  });
}

export function useNutrient(id: string | undefined) {
  return useQuery({
    queryKey: nutrientKeys.detail(id ?? ''),
    queryFn: () => fetchNutrient(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateNutrient() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateNutrientInput) => createNutrient(input),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: nutrientKeys.all });
      toast.success('Nutrient created.');
    },
    onError: toastError('Failed to create nutrient.'),
  });
}

export function useUpdateNutrient() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateNutrientInput }) =>
      updateNutrient(id, input),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: nutrientKeys.all });
      toast.success('Nutrient updated.');
    },
    onError: toastError('Failed to update nutrient.'),
  });
}

export function useDeleteNutrient() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNutrient(id),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: nutrientKeys.all });
      toast.success('Nutrient deleted.');
    },
    onError: toastError('Failed to delete nutrient.'),
  });
}
