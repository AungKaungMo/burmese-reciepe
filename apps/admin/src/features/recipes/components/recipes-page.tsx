import { Plus } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { RecipeTable } from '@/features/recipes/components/recipe-table';
import { useRecipes, useDeleteRecipe } from '@/features/recipes/api/queries';
import { toRecipeRow, type RecipeRow } from '@/features/recipes/types';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

export function RecipesPage() {
  const { data, isPending, isError, error } = useRecipes();
  const deleteRecipe = useDeleteRecipe();

  const rows = useMemo(() => (data?.items ?? []).map(toRecipeRow), [data]);

  function handleDelete(recipe: RecipeRow) {
    if (window.confirm(`Delete “${recipe.title}”? This cannot be undone.`)) {
      deleteRecipe.mutate(recipe.id);
    }
  }

  return (
    <>
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Recipes</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create, publish and manage your recipe collection.</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/recipes/new">
            <Plus className="size-4" /> Add Recipe
          </Link>
        </Button>
      </section>

      <div className="mt-6">
        {isPending ? (
          <Card className="p-10 text-center text-sm text-muted-foreground">Loading recipes…</Card>
        ) : isError ? (
          <Card className="p-10 text-center text-sm text-destructive">
            {error instanceof Error ? error.message : 'Failed to load recipes.'}
          </Card>
        ) : (
          <RecipeTable recipes={rows} onDelete={handleDelete} />
        )}
      </div>
    </>
  );
}
