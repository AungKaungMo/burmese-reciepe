import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { useRecipe } from '@/features/recipes/api/queries';
import { RecipeFormFields } from '@/features/recipes/components/recipe-form-fields';
import { useRecipeForm } from '@/features/recipes/hooks/use-recipe-form';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

export function RecipeEditPage() {
  const { id } = useParams<{ id: string }>();
  const { data: recipe, isPending, isError, error } = useRecipe(id);

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/recipes" className="transition-colors hover:text-foreground">
          Recipes
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">Edit Recipe</span>
      </nav>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Edit Recipe</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update this recipe’s details, translations and steps.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/recipes">
            <ArrowLeft className="size-4" /> Back to Recipes
          </Link>
        </Button>
      </section>

      {isPending ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">Loading recipe…</Card>
      ) : isError ? (
        <Card className="p-10 text-center text-sm text-destructive">
          {error instanceof Error ? error.message : 'Failed to load recipe.'}
        </Card>
      ) : (
        <RecipeEditForm recipe={recipe} />
      )}
    </div>
  );
}

/**
 * Rendered only once the recipe is loaded so the form seeds with real values on
 * first mount (its own `useRecipeForm` instance, keyed by the parent's branch).
 */
function RecipeEditForm({
  recipe,
}: {
  recipe: NonNullable<ReturnType<typeof useRecipe>['data']>;
}) {
  const { form, submit, cover, setCover, currentCoverUrl, isBusy, isUploading, isSaving, errorMessage } =
    useRecipeForm(recipe);

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <RecipeFormFields
        form={form}
        cover={cover}
        onCoverChange={setCover}
        currentCoverUrl={currentCoverUrl}
      />

      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" disabled={isBusy} asChild>
          <Link to="/recipes">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isBusy}>
          {isUploading ? 'Uploading…' : isSaving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
