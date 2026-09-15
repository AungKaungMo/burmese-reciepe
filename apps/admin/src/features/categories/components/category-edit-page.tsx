import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { CategoryFormFields } from '@/features/categories/components/category-form-fields';
import { useCategory } from '@/features/categories/api/queries';
import { useCategoryForm } from '@/features/categories/hooks/use-category-form';

export function CategoryEditPage() {
  const { id } = useParams<{ id: string }>();
  const { data: category, isPending, isError, error } = useCategory(id);

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/categories" className="transition-colors hover:text-foreground">
          Categories
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">Edit Category</span>
      </nav>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Edit Category</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update this category’s details and translations.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/categories">
            <ArrowLeft className="size-4" /> Back to Categories
          </Link>
        </Button>
      </section>

      {isPending ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">Loading category…</Card>
      ) : isError ? (
        <Card className="p-10 text-center text-sm text-destructive">
          {error instanceof Error ? error.message : 'Failed to load category.'}
        </Card>
      ) : (
        <CategoryEditForm category={category} />
      )}
    </div>
  );
}

/**
 * Rendered only once the category is loaded so the form seeds with real values on
 * first mount (its own `useCategoryForm` instance, keyed by the parent's branch).
 */
function CategoryEditForm({
  category,
}: {
  category: NonNullable<ReturnType<typeof useCategory>['data']>;
}) {
  const { form, submit, icon, setIcon, currentIconUrl, isBusy, isUploading, isSaving, errorMessage } =
    useCategoryForm(category);

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <CategoryFormFields
        form={form}
        icon={icon}
        onIconChange={setIcon}
        currentIconUrl={currentIconUrl}
      />

      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" disabled={isBusy} asChild>
          <Link to="/categories">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isBusy}>
          {isUploading ? 'Uploading…' : isSaving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
