import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { MeasurementUnitTable } from '@/features/measurement-units/components/measurement-unit-table';
import { useMeasurementUnitsPage } from '@/features/measurement-units/hooks/use-measurement-units-page';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

export function MeasurementUnitsPage() {
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
  } = useMeasurementUnitsPage();

  return (
    <>
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Measurement Units</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the units (g, ml, tbsp…) used to measure ingredients.
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/measurement-units/new">
            <Plus className="size-4" /> Add Unit
          </Link>
        </Button>
      </section>

      <div className="mt-6">
        {isError ? (
          <Card className="p-10 text-center text-sm text-destructive">
            {error instanceof Error ? error.message : 'Failed to load measurement units.'}
          </Card>
        ) : (
          <MeasurementUnitTable
            units={rows}
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
