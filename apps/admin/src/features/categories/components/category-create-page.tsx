import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { CategoryFormFields } from '@/features/categories/components/category-form-fields';
import { useCategoryForm } from '@/features/categories/hooks/use-category-form';

export function CategoryCreatePage() {
  const { form, submit, icon, setIcon, isBusy, isUploading, isSaving, errorMessage } =
    useCategoryForm();

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/categories" className="transition-colors hover:text-foreground">
          Categories
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">Create Category</span>
      </nav>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Create Category</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a new category to organize your recipes. Provide details and translations.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/categories">
            <ArrowLeft className="size-4" /> Back to Categories
          </Link>
        </Button>
      </section>

      <CategoryFormFields form={form} icon={icon} onIconChange={setIcon} />

      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" disabled={isBusy} asChild>
          <Link to="/categories">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isBusy}>
          {isUploading ? 'Uploading…' : isSaving ? 'Creating…' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
}
