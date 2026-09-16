import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { NutrientTable } from '@/features/nutrients/components/nutrient-table';
import { useNutrientsPage } from '@/features/nutrients/hooks/use-nutrients-page';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

export function NutrientsPage() {
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
    onEdit,
    onDelete,
  } = useNutrientsPage();

  return (
    <>
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Nutrition</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the nutrients (protein, fat, calories…) tracked on recipes.
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/nutrients/new">
            <Plus className="size-4" /> Add Nutrient
          </Link>
        </Button>
      </section>

      <div className="mt-6">
        {isError ? (
          <Card className="p-10 text-center text-sm text-destructive">
            {error instanceof Error ? error.message : 'Failed to load nutrients.'}
          </Card>
        ) : (
          <NutrientTable
            nutrients={rows}
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            search={search}
            onSearchChange={setSearch}
            isLoading={isPending}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </div>
    </>
  );
}
