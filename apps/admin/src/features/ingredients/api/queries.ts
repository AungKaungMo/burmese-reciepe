import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type {
  CreateIngredientInput,
  ListIngredientsQuery,
  UpdateIngredientInput,
} from '@repo/contracts';

import {
  createIngredient,
  deleteIngredient,
  fetchIngredient,
  fetchIngredients,
  importIngredients,
  updateIngredient,
} from './ingredients';

export const ingredientKeys = {
  all: ['ingredients'] as const,
  list: (query: ListIngredientsQuery) => ['ingredients', 'list', query] as const,
  detail: (id: string) => ['ingredients', 'detail', id] as const,
};

/** The `api` interceptor collapses error envelopes to `Error`, so use its message. */
function toastError(fallback: string) {
  return (error: unknown) => toast.error(error instanceof Error ? error.message : fallback);
}

export function useIngredients(query: ListIngredientsQuery) {
  return useQuery({
    queryKey: ingredientKeys.list(query),
    queryFn: () => fetchIngredients(query),
    placeholderData: keepPreviousData,
  });
}

export function useIngredient(id: string | undefined) {
  return useQuery({
    queryKey: ingredientKeys.detail(id ?? ''),
    queryFn: () => fetchIngredient(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateIngredient() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateIngredientInput) => createIngredient(input),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ingredientKeys.all });
      toast.success('Ingredient created.');
    },
    onError: toastError('Failed to create ingredient.'),
  });
}

export function useUpdateIngredient() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateIngredientInput }) =>
      updateIngredient(id, input),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ingredientKeys.all });
      toast.success('Ingredient updated.');
    },
    onError: toastError('Failed to update ingredient.'),
  });
}

export function useDeleteIngredient() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteIngredient(id),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ingredientKeys.all });
      toast.success('Ingredient deleted.');
    },
    onError: toastError('Failed to delete ingredient.'),
  });
}

export function useImportIngredients() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => importIngredients(file),
    onSuccess: (result) => {
      client.invalidateQueries({ queryKey: ingredientKeys.all });
      if (result.created > 0) {
        toast.success(`Imported ${result.created} ingredient${result.created === 1 ? '' : 's'}.`);
      }
      if (result.failed > 0) {
        toast.error(`${result.failed} row${result.failed === 1 ? '' : 's'} could not be imported.`);
      }
      if (result.created === 0 && result.failed === 0) {
        toast.info('The spreadsheet had no rows to import.');
      }
    },
    onError: toastError('Failed to import ingredients.'),
  });
}
