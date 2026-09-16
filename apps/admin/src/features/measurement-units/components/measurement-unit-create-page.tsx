import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { MeasurementUnitFormFields } from '@/features/measurement-units/components/measurement-unit-form-fields';
import { useMeasurementUnitForm } from '@/features/measurement-units/hooks/use-measurement-unit-form';
import { Button } from '@/shared/components/ui/button';

export function MeasurementUnitCreatePage() {
  const { form, submit, isBusy, isSaving, errorMessage } = useMeasurementUnitForm();

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/measurement-units" className="transition-colors hover:text-foreground">
          Measurement Units
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">Create Unit</span>
      </nav>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Create Measurement Unit</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a new unit with its details and translations.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/measurement-units">
            <ArrowLeft className="size-4" /> Back to Units
          </Link>
        </Button>
      </section>

      <MeasurementUnitFormFields form={form} />

      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" disabled={isBusy} asChild>
          <Link to="/measurement-units">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isBusy}>
          {isSaving ? 'Creating…' : 'Create Unit'}
        </Button>
      </div>
    </form>
  );
}
