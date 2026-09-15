import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { IngredientFormFields } from '@/features/ingredients/components/ingredient-form-fields';
import { useIngredientForm } from '@/features/ingredients/hooks/use-ingredient-form';

export function IngredientCreatePage() {
  const { form, submit, icon, setIcon, isBusy, isUploading, isSaving, errorMessage } =
    useIngredientForm();

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/ingredients" className="transition-colors hover:text-foreground">
          Ingredients
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">Create Ingredient</span>
      </nav>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Create Ingredient</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a new ingredient. Provide details and translations.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/ingredients">
            <ArrowLeft className="size-4" /> Back to Ingredients
          </Link>
        </Button>
      </section>

      <IngredientFormFields form={form} icon={icon} onIconChange={setIcon} />

      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" disabled={isBusy} asChild>
          <Link to="/ingredients">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isBusy}>
          {isUploading ? 'Uploading…' : isSaving ? 'Creating…' : 'Create Ingredient'}
        </Button>
      </div>
    </form>
  );
}
