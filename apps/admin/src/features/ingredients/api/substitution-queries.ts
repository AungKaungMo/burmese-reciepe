import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type {
  CreateIngredientSubstitutionInput,
  ListIngredientSubstitutionsQuery,
  UpdateIngredientSubstitutionInput,
} from '@repo/contracts';

import {
  createSubstitution,
  deleteSubstitution,
  fetchSubstitutions,
  updateSubstitution,
} from './substitutions';

export const substitutionKeys = {
  all: ['ingredient-substitutions'] as const,
  list: (query: ListIngredientSubstitutionsQuery) =>
    ['ingredient-substitutions', 'list', query] as const,
};

/** The `api` interceptor collapses error envelopes to `Error`, so use its message. */
function toastError(fallback: string) {
  return (error: unknown) => toast.error(error instanceof Error ? error.message : fallback);
}

export function useSubstitutions(query: ListIngredientSubstitutionsQuery) {
  return useQuery({
    queryKey: substitutionKeys.list(query),
    queryFn: () => fetchSubstitutions(query),
    placeholderData: keepPreviousData,
  });
}

export function useCreateSubstitution() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateIngredientSubstitutionInput) => createSubstitution(input),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: substitutionKeys.all });
      toast.success('Substitution added.');
    },
    onError: toastError('Failed to add substitution.'),
  });
}

export function useUpdateSubstitution() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateIngredientSubstitutionInput }) =>
      updateSubstitution(id, input),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: substitutionKeys.all });
      toast.success('Substitution updated.');
    },
    onError: toastError('Failed to update substitution.'),
  });
}

export function useDeleteSubstitution() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSubstitution(id),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: substitutionKeys.all });
      toast.success('Substitution deleted.');
    },
    onError: toastError('Failed to delete substitution.'),
  });
}
