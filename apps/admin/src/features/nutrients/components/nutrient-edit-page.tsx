import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { useNutrient } from '@/features/nutrients/api/queries';
import { NutrientFormFields } from '@/features/nutrients/components/nutrient-form-fields';
import { useNutrientForm } from '@/features/nutrients/hooks/use-nutrient-form';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

export function NutrientEditPage() {
  const { id } = useParams<{ id: string }>();
  const { data: nutrient, isPending, isError, error } = useNutrient(id);

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/nutrients" className="transition-colors hover:text-foreground">
          Nutrition
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">Edit Nutrient</span>
      </nav>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Edit Nutrient</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update this nutrient’s unit, icon and translations.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/nutrients">
            <ArrowLeft className="size-4" /> Back to Nutrition
          </Link>
        </Button>
      </section>

      {isPending ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">Loading nutrient…</Card>
      ) : isError ? (
        <Card className="p-10 text-center text-sm text-destructive">
          {error instanceof Error ? error.message : 'Failed to load nutrient.'}
        </Card>
      ) : (
        <NutrientEditForm nutrient={nutrient} />
      )}
    </div>
  );
}

/**
 * Rendered only once the nutrient is loaded so the form seeds with real values on
 * first mount (its own `useNutrientForm` instance, keyed by the parent's branch).
 */
function NutrientEditForm({
  nutrient,
}: {
  nutrient: NonNullable<ReturnType<typeof useNutrient>['data']>;
}) {
  const { form, submit, icon, setIcon, currentIconUrl, isBusy, isUploading, isSaving, errorMessage } =
    useNutrientForm(nutrient);

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <NutrientFormFields
        form={form}
        icon={icon}
        onIconChange={setIcon}
        currentIconUrl={currentIconUrl}
      />

      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" disabled={isBusy} asChild>
          <Link to="/nutrients">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isBusy}>
          {isUploading ? 'Uploading…' : isSaving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
