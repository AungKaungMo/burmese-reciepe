import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { ImportResult, ListIngredientsQuery } from '@repo/contracts';

import type { IngredientStatusFilter } from '@/features/ingredients/components/ingredient-table';
import {
  useIngredients,
  useDeleteIngredient,
  useImportIngredients,
} from '@/features/ingredients/api/queries';
import { toIngredientRow } from '@/features/ingredients/mappers';
import type { IngredientRow } from '@/features/ingredients/types';
import { useConfirm } from '@/shared/components/confirm-dialog';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';

const PAGE_SIZE = 8;

export function useIngredientsPage() {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<IngredientStatusFilter>('all');
  const [page, setPage] = useState(1);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const debouncedSearch = useDebouncedValue(search.trim(), 600);

  // A new search or status filter should send us back to the first page.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const query = useMemo<ListIngredientsQuery>(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(status !== 'all' ? { isActive: status === 'active' } : {}),
    }),
    [page, debouncedSearch, status],
  );

  const { data, isPending, isError, error } = useIngredients(query);
  const deleteIngredient = useDeleteIngredient();
  const importIngredients = useImportIngredients();

  const rows = useMemo(() => (data?.items ?? []).map(toIngredientRow), [data]);

  function handleEdit(ingredient: IngredientRow) {
    navigate(`/ingredients/${ingredient.id}/edit`);
  }

  async function handleDelete(ingredient: IngredientRow) {
    const confirmed = await confirm({
      title: `Delete “${ingredient.name}”?`,
      description: 'This cannot be undone.',
      confirmLabel: 'Delete',
    });
    if (confirmed) deleteIngredient.mutate(ingredient.id);
  }

  function handleImport(file: File) {
    importIngredients.mutate(file, { onSuccess: setImportResult });
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
    isImporting: importIngredients.isPending,
    onEdit: handleEdit,
    onDelete: handleDelete,
  };
}
