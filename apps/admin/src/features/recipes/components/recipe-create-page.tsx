import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { RecipeFormFields } from '@/features/recipes/components/recipe-form-fields';
import { useRecipeForm } from '@/features/recipes/hooks/use-recipe-form';
import { Button } from '@/shared/components/ui/button';

export function RecipeCreatePage() {
  const { form, submit, cover, setCover, isBusy, isUploading, isSaving, errorMessage } =
    useRecipeForm();

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/recipes" className="transition-colors hover:text-foreground">
          Recipes
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">Create Recipe</span>
      </nav>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Create Recipe</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a new recipe with its details, translations and steps.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/recipes">
            <ArrowLeft className="size-4" /> Back to Recipes
          </Link>
        </Button>
      </section>

      <RecipeFormFields form={form} cover={cover} onCoverChange={setCover} />

      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" disabled={isBusy} asChild>
          <Link to="/recipes">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isBusy}>
          {isUploading ? 'Uploading…' : isSaving ? 'Creating…' : 'Create Recipe'}
        </Button>
      </div>
    </form>
  );
}
