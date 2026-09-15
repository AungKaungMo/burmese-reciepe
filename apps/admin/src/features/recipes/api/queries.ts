import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type {
  CreateRecipeInput,
  ListRecipesQuery,
  UpdateRecipeInput,
} from '@repo/contracts';

import {
  createRecipe,
  deleteRecipe,
  fetchRecipe,
  fetchRecipes,
  importRecipes,
  updateRecipe,
} from './recipes';

export const recipeKeys = {
  all: ['recipes'] as const,
  list: (query: ListRecipesQuery) => ['recipes', 'list', query] as const,
  detail: (id: string) => ['recipes', 'detail', id] as const,
};

/** The `api` interceptor collapses error envelopes to `Error`, so use its message. */
function toastError(fallback: string) {
  return (error: unknown) => toast.error(error instanceof Error ? error.message : fallback);
}

export function useRecipes(query: ListRecipesQuery = { page: 1, pageSize: 20 }) {
  return useQuery({
    queryKey: recipeKeys.list(query),
    queryFn: () => fetchRecipes(query),
    placeholderData: keepPreviousData,
  });
}

export function useRecipe(id: string | undefined) {
  return useQuery({
    queryKey: recipeKeys.detail(id ?? ''),
    queryFn: () => fetchRecipe(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateRecipe() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRecipeInput) => createRecipe(input),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: recipeKeys.all });
      toast.success('Recipe created.');
    },
    onError: toastError('Failed to create recipe.'),
  });
}

export function useUpdateRecipe() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateRecipeInput }) =>
      updateRecipe(id, input),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: recipeKeys.all });
      toast.success('Recipe updated.');
    },
    onError: toastError('Failed to update recipe.'),
  });
}

export function useDeleteRecipe() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRecipe(id),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: recipeKeys.all });
      toast.success('Recipe deleted.');
    },
    onError: toastError('Failed to delete recipe.'),
  });
}

export function useImportRecipes() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => importRecipes(file),
    onSuccess: (result) => {
      client.invalidateQueries({ queryKey: recipeKeys.all });
      if (result.created > 0) {
        toast.success(`Imported ${result.created} recipe${result.created === 1 ? '' : 's'}.`);
      }
      if (result.failed > 0) {
        toast.error(`${result.failed} row${result.failed === 1 ? '' : 's'} could not be imported.`);
      }
      if (result.created === 0 && result.failed === 0) {
        toast.info('The spreadsheet had no rows to import.');
      }
    },
    onError: toastError('Failed to import recipes.'),
  });
}
