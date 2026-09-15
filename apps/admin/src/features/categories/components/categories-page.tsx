import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import type { ListCategoriesQuery } from '@repo/contracts';

import {
  CategoryTable,
  type CategoryStatusFilter,
} from '@/features/categories/components/category-table';
import { useCategories, useDeleteCategory } from '@/features/categories/api/queries';
import { toCategoryRow, type CategoryRow } from '@/features/categories/types';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';

const PAGE_SIZE = 8;

export function CategoriesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<CategoryStatusFilter>('all');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search.trim(), 600);

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

  const rows = useMemo(() => (data?.items ?? []).map(toCategoryRow), [data]);

  function handleEdit(category: CategoryRow) {
    navigate(`/categories/${category.id}/edit`);
  }

  function handleDelete(category: CategoryRow) {
    if (window.confirm(`Delete “${category.name}”? This cannot be undone.`)) {
      deleteCategory.mutate(category.id);
    }
  }

  return (
    <>
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">Organize your recipes into categories to make them easier to find.</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/categories/new">
            <Plus className="size-4" /> Add Category
          </Link>
        </Button>
      </section>

      <div className="mt-6">
        {isError ? (
          <Card className="p-10 text-center text-sm text-destructive">
            {error instanceof Error ? error.message : 'Failed to load categories.'}
          </Card>
        ) : (
          <CategoryTable
            categories={rows}
            total={data?.total ?? 0}
            page={page}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            isLoading={isPending}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </>
  );
}
