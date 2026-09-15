import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { ImportResult, ListRecipesQuery } from '@repo/contracts';

import type { RecipeStatusFilter } from '@/features/recipes/components/recipe-table';
import { useRecipes, useDeleteRecipe, useImportRecipes } from '@/features/recipes/api/queries';
import { toRecipeRow, type RecipeRow } from '@/features/recipes/types';
import { useConfirm } from '@/shared/components/confirm-dialog';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';

const PAGE_SIZE = 8;

export function useRecipesPage() {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<RecipeStatusFilter>('all');
  const [page, setPage] = useState(1);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const debouncedSearch = useDebouncedValue(search.trim(), 600);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const query = useMemo<ListRecipesQuery>(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(status !== 'all' ? { status } : {}),
    }),
    [page, debouncedSearch, status],
  );

  const { data, isPending, isError, error } = useRecipes(query);
  const deleteRecipe = useDeleteRecipe();
  const importRecipes = useImportRecipes();

  const rows = useMemo(() => (data?.items ?? []).map(toRecipeRow), [data]);

  function handleEdit(recipe: RecipeRow) {
    navigate(`/recipes/${recipe.id}/edit`);
  }

  async function handleDelete(recipe: RecipeRow) {
    const confirmed = await confirm({
      title: `Delete “${recipe.title}”?`,
      description: 'This cannot be undone.',
      confirmLabel: 'Delete',
    });
    if (confirmed) deleteRecipe.mutate(recipe.id);
  }

  function handleImport(file: File) {
    importRecipes.mutate(file, { onSuccess: setImportResult });
  }

  return {
    rows,
    total: data?.total ?? 0,
    pageSize: PAGE_SIZE,
    isPending,
    isError,
    error,
    page,
    setPage,
    search,
    setSearch,
    status,
    setStatus,
    importResult,
    dismissImportResult: () => setImportResult(null),
    onImport: handleImport,
    isImporting: importRecipes.isPending,
    onEdit: handleEdit,
    onDelete: handleDelete,
  };
}
