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
  fetchAllCategories,
  fetchCategories,
  fetchCategory,
  importCategories,
  updateCategory,
  type CategoryFilters,
} from './categories';

export const categoryKeys = {
  all: ['categories'] as const,
  list: (query: ListCategoriesQuery) => ['categories', 'list', query] as const,
  full: (filters: CategoryFilters) => ['categories', 'full', filters] as const,
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

/**
 * Loads the complete set of categories matching `filters` (all pages), for pickers
 * that must offer every option rather than just the first page.
 */
export function useAllCategories(filters: CategoryFilters = {}) {
  return useQuery({
    queryKey: categoryKeys.full(filters),
    queryFn: () => fetchAllCategories(filters),
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

export function useImportCategories() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => importCategories(file),
    onSuccess: (result) => {
      client.invalidateQueries({ queryKey: categoryKeys.all });
      if (result.created > 0) {
        toast.success(`Imported ${result.created} categor${result.created === 1 ? 'y' : 'ies'}.`);
      }
      if (result.failed > 0) {
        toast.error(`${result.failed} row${result.failed === 1 ? '' : 's'} could not be imported.`);
      }
      if (result.created === 0 && result.failed === 0) {
        toast.info('The spreadsheet had no rows to import.');
      }
    },
    onError: toastError('Failed to import categories.'),
  });
}
