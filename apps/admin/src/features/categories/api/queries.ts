import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type {
  CreateCategoryInput,
  ListCategoriesQuery,
  UpdateCategoryInput,
} from '@repo/contracts';

import {
  createCategory,
  deleteCategory,
  fetchCategories,
  fetchCategory,
  updateCategory,
} from './categories';

export const categoryKeys = {
  all: ['categories'] as const,
  list: (query: ListCategoriesQuery) => ['categories', 'list', query] as const,
  detail: (id: string) => ['categories', 'detail', id] as const,
};

export function useCategories(query: ListCategoriesQuery) {
  return useQuery({
    queryKey: categoryKeys.list(query),
    queryFn: () => fetchCategories(query),
    // Keep the previous page visible while the next one loads (no flash to empty).
    placeholderData: keepPreviousData,
  });
}

export function useCategory(id: string | undefined) {
  return useQuery({
    queryKey: categoryKeys.detail(id ?? ''),
    queryFn: () => fetchCategory(id as string),
    enabled: Boolean(id),
  });
}

/** The `api` interceptor collapses error envelopes to `Error`, so use its message. */
function toastError(fallback: string) {
  return (error: unknown) => toast.error(error instanceof Error ? error.message : fallback);
}

export function useCreateCategory() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCategoryInput) => createCategory(input),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success('Category created.');
    },
    onError: toastError('Failed to create category.'),
  });
}

export function useUpdateCategory() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCategoryInput }) =>
      updateCategory(id, input),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success('Category updated.');
    },
    onError: toastError('Failed to update category.'),
  });
}

export function useDeleteCategory() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success('Category deleted.');
    },
    onError: toastError('Failed to delete category.'),
  });
}
