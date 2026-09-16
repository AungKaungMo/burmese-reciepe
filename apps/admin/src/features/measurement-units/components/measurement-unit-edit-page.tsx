import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { useMeasurementUnit } from '@/features/measurement-units/api/queries';
import { MeasurementUnitFormFields } from '@/features/measurement-units/components/measurement-unit-form-fields';
import { useMeasurementUnitForm } from '@/features/measurement-units/hooks/use-measurement-unit-form';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

export function MeasurementUnitEditPage() {
  const { id } = useParams<{ id: string }>();
  const { data: unit, isPending, isError, error } = useMeasurementUnit(id);

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/measurement-units" className="transition-colors hover:text-foreground">
          Measurement Units
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">Edit Unit</span>
      </nav>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Edit Measurement Unit</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update this unit’s details and translations.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/measurement-units">
            <ArrowLeft className="size-4" /> Back to Units
          </Link>
        </Button>
      </section>

      {isPending ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">Loading unit…</Card>
      ) : isError ? (
        <Card className="p-10 text-center text-sm text-destructive">
          {error instanceof Error ? error.message : 'Failed to load measurement unit.'}
        </Card>
      ) : (
        <MeasurementUnitEditForm unit={unit} />
      )}
    </div>
  );
}

/**
 * Rendered only once the unit is loaded so the form seeds with real values on first
 * mount (its own `useMeasurementUnitForm` instance, keyed by the parent's branch).
 */
function MeasurementUnitEditForm({
  unit,
}: {
  unit: NonNullable<ReturnType<typeof useMeasurementUnit>['data']>;
}) {
  const { form, submit, isBusy, isSaving, errorMessage } = useMeasurementUnitForm(unit);

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <MeasurementUnitFormFields form={form} />

      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" disabled={isBusy} asChild>
          <Link to="/measurement-units">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isBusy}>
          {isSaving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
