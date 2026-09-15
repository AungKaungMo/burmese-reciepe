import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { CategoryTable } from '@/features/categories/components/category-table';
import { useCategoriesPage } from '@/features/categories/hooks/use-categories-page';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { ImportButton } from '@/shared/components/import-button';
import { ImportResultCard } from '@/shared/components/import-result-card';

export function CategoriesPage() {
  const {
    rows,
    total,
    pageSize,
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
    dismissImportResult,
    onImport,
    isImporting,
    onEdit,
    onDelete,
  } = useCategoriesPage();

  return (
    <>
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">Organize your recipes into categories to make them easier to find.</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <ImportButton onFile={onImport} isPending={isImporting} />
          <Button asChild className="w-full sm:w-auto">
            <Link to="/categories/new">
              <Plus className="size-4" /> Add Category
            </Link>
          </Button>
        </div>
      </section>

      {importResult && (
        <ImportResultCard result={importResult} onDismiss={dismissImportResult} />
      )}

      <div className="mt-6">
        {isError ? (
          <Card className="p-10 text-center text-sm text-destructive">
            {error instanceof Error ? error.message : 'Failed to load categories.'}
          </Card>
        ) : (
          <CategoryTable
            categories={rows}
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            isLoading={isPending}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </div>
    </>
  );
}
