import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { NutrientFormFields } from '@/features/nutrients/components/nutrient-form-fields';
import { useNutrientForm } from '@/features/nutrients/hooks/use-nutrient-form';
import { Button } from '@/shared/components/ui/button';

export function NutrientCreatePage() {
  const { form, submit, icon, setIcon, isBusy, isUploading, isSaving, errorMessage } =
    useNutrientForm();

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/nutrients" className="transition-colors hover:text-foreground">
          Nutrition
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">Create Nutrient</span>
      </nav>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Create Nutrient</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a new nutrient with its unit and translations.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/nutrients">
            <ArrowLeft className="size-4" /> Back to Nutrition
          </Link>
        </Button>
      </section>

      <NutrientFormFields form={form} icon={icon} onIconChange={setIcon} />

      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" disabled={isBusy} asChild>
          <Link to="/nutrients">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isBusy}>
          {isUploading ? 'Uploading…' : isSaving ? 'Creating…' : 'Create Nutrient'}
        </Button>
      </div>
    </form>
  );
}
