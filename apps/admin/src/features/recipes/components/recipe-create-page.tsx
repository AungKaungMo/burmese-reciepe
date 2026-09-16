import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { RecipeFormWizard } from '@/features/recipes/components/recipe-form-wizard';
import { useRecipeForm } from '@/features/recipes/hooks/use-recipe-form';
import { Button } from '@/shared/components/ui/button';

export function RecipeCreatePage() {
  const api = useRecipeForm();

  return (
    <div className="flex flex-col gap-6">
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

      <RecipeFormWizard api={api} submitLabel="Create Recipe" />
    </div>
  );
}
