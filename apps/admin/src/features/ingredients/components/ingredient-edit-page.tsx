import { ArrowLeft, ChevronRight, Replace, SlidersHorizontal } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { IngredientFormFields } from '@/features/ingredients/components/ingredient-form-fields';
import { SubstitutionsPanel } from '@/features/ingredients/components/substitutions-panel';
import { useIngredient } from '@/features/ingredients/api/queries';
import { useIngredientForm } from '@/features/ingredients/hooks/use-ingredient-form';

export function IngredientEditPage() {
  const { id } = useParams<{ id: string }>();
  const { data: ingredient, isPending, isError, error } = useIngredient(id);

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/ingredients" className="transition-colors hover:text-foreground">
          Ingredients
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">Edit Ingredient</span>
      </nav>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Edit Ingredient</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update this ingredient’s details and translations.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/ingredients">
            <ArrowLeft className="size-4" /> Back to Ingredients
          </Link>
        </Button>
      </section>

      {isPending ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">Loading ingredient…</Card>
      ) : isError ? (
        <Card className="p-10 text-center text-sm text-destructive">
          {error instanceof Error ? error.message : 'Failed to load ingredient.'}
        </Card>
      ) : (
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">
              <SlidersHorizontal /> Details
            </TabsTrigger>
            <TabsTrigger value="substitutions">
              <Replace /> Substitutions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <IngredientEditForm ingredient={ingredient} />
          </TabsContent>

          <TabsContent value="substitutions">
            <SubstitutionsPanel ingredient={ingredient} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

/**
 * Rendered only once the ingredient is loaded so the form seeds with real values on
 * first mount (its own `useIngredientForm` instance, keyed by the parent's branch).
 */
function IngredientEditForm({
  ingredient,
}: {
  ingredient: NonNullable<ReturnType<typeof useIngredient>['data']>;
}) {
  const { form, submit, icon, setIcon, currentIconUrl, isBusy, isUploading, isSaving, errorMessage } =
    useIngredientForm(ingredient);

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <IngredientFormFields
        form={form}
        icon={icon}
        onIconChange={setIcon}
        currentIconUrl={currentIconUrl}
      />

      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" disabled={isBusy} asChild>
          <Link to="/ingredients">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isBusy}>
          {isUploading ? 'Uploading…' : isSaving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
