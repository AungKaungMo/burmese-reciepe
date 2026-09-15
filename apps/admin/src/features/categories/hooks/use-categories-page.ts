import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { ImportResult, ListCategoriesQuery } from '@repo/contracts';

import type { CategoryStatusFilter } from '@/features/categories/components/category-table';
import {
  useCategories,
  useDeleteCategory,
  useImportCategories,
} from '@/features/categories/api/queries';
import { toCategoryRow, type CategoryRow } from '@/features/categories/types';
import { useConfirm } from '@/shared/components/confirm-dialog';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';

const PAGE_SIZE = 8;

/**
 * Owns the categories list screen: search/status/page state (with debounced search
 * and page reset on filter change), the server query, and the edit/delete/import
 * handlers. The page consumes this and stays presentational.
 */
export function useCategoriesPage() {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<CategoryStatusFilter>('all');
  const [page, setPage] = useState(1);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const debouncedSearch = useDebouncedValue(search.trim(), 600);

  // A new search or status filter should send us back to the first page.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const query = useMemo<ListCategoriesQuery>(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(status !== 'all' ? { isActive: status === 'active' } : {}),
    }),
    [page, debouncedSearch, status],
  );

  const { data, isPending, isError, error } = useCategories(query);
  const deleteCategory = useDeleteCategory();
  const importCategories = useImportCategories();

  const rows = useMemo(() => (data?.items ?? []).map(toCategoryRow), [data]);

  function handleEdit(category: CategoryRow) {
    navigate(`/categories/${category.id}/edit`);
  }

  async function handleDelete(category: CategoryRow) {
    const confirmed = await confirm({
      title: `Delete “${category.name}”?`,
      description: 'This cannot be undone.',
      confirmLabel: 'Delete',
    });
    if (confirmed) deleteCategory.mutate(category.id);
  }

  function handleImport(file: File) {
    importCategories.mutate(file, { onSuccess: setImportResult });
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
    isImporting: importCategories.isPending,
    onEdit: handleEdit,
    onDelete: handleDelete,
  };
}
