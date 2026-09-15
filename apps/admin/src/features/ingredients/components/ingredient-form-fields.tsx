import { Languages, SlidersHorizontal } from 'lucide-react';
import { useMemo } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';

import type { Category } from '@repo/contracts';

import { useAllCategories } from '@/features/categories/api/queries';
import { LANGUAGES } from '@/features/categories/hooks/use-category-form';
import { SvgUploadField } from '@/shared/components/svg-upload-field';
import type { IngredientFormValues } from '@/features/ingredients/hooks/use-ingredient-form';
import { Card } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';

/** English-first display name for a category, falling back to its code. */
function categoryLabel(category: Category): string {
  const translation =
    category.translations.find((t) => t.languageCode === 'EN') ?? category.translations[0];
  return translation?.name ?? category.code;
}

type IngredientFormFieldsProps = {
  form: UseFormReturn<IngredientFormValues>;
  icon: File | null;
  onIconChange: (file: File | null) => void;
  currentIconUrl?: string | null;
};

/** Shared Details + Translations fields, used by both the create and edit pages. */
export function IngredientFormFields({
  form,
  icon,
  onIconChange,
  currentIconUrl,
}: IngredientFormFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  // Ingredients belong to an INGREDIENT-scope category; load them ALL (across pages)
  // so every category — including an ingredient's current one when editing — is selectable.
  const { data: categories } = useAllCategories({ scope: 'INGREDIENT' });

  const categoryOptions = useMemo(
    () => (categories ?? []).map((c) => ({ id: c.id, label: categoryLabel(c) })),
    [categories],
  );

  return (
    <>
      <Card className="flex flex-col gap-5 p-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-primary" />
          <h2 className="text-base font-semibold tracking-tight">Ingredient Details</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ingredient-category">
              Category <span className="text-primary">*</span>
            </Label>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select value={field.value || undefined} onValueChange={field.onChange}>
                  <SelectTrigger id="ingredient-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && (
              <p className="text-xs text-destructive">{errors.categoryId.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ingredient-code">
              Code <span className="text-primary">*</span>
            </Label>
            <Input id="ingredient-code" placeholder="e.g. fish-sauce" {...register('code')} />
            <p className="text-xs text-muted-foreground">
              Unique machine key, lowercase, hyphenated (e.g. fish-sauce).
            </p>
            {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ingredient-emoji">Emoji</Label>
            <Input id="ingredient-emoji" placeholder="e.g. 🐟" maxLength={8} {...register('emoji')} />
            <p className="text-xs text-muted-foreground">
              Optional. Shown when no icon is uploaded.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ingredient-status">Status</Label>
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <div className="flex h-10 items-center gap-3 rounded-md border border-input px-3">
                  <Switch
                    id="ingredient-status"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <span className="text-sm font-medium">{field.value ? 'Active' : 'Inactive'}</span>
                </div>
              )}
            />
            <p className="text-xs text-muted-foreground">Inactive ingredients are not shown to users.</p>
          </div>
        </div>

        <SvgUploadField
          label="Icon"
          hint="SVG, max 512KB"
          file={icon}
          onChange={onIconChange}
          currentUrl={currentIconUrl}
        />
      </Card>

      <Card className="flex flex-col gap-5 p-5">
        <div className="flex items-center gap-2">
          <Languages className="size-4 text-primary" />
          <div>
            <h2 className="text-base font-semibold tracking-tight">Translations</h2>
            <p className="text-xs text-muted-foreground">
              Add names and search aliases in different languages. At least one translation is required.
            </p>
          </div>
        </div>

        {LANGUAGES.map((language) => (
          <div key={language.code} className="flex flex-col gap-4 rounded-lg border border-border p-4">
            <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {language.label}
            </span>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`name-${language.code}`}>
                  Name <span className="text-primary">*</span>
                </Label>
                <Input
                  id={`name-${language.code}`}
                  placeholder={`Name in ${language.label}`}
                  {...register(`translations.${language.code}.name`)}
                />
                {errors.translations?.[language.code]?.name && (
                  <p className="text-xs text-destructive">
                    {errors.translations[language.code]?.name?.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`aliases-${language.code}`}>Aliases</Label>
                <Input
                  id={`aliases-${language.code}`}
                  placeholder="Comma-separated, e.g. ngan pya ye, fish sauce"
                  {...register(`translations.${language.code}.aliases`)}
                />
                <p className="text-xs text-muted-foreground">
                  Alternate names/spellings used for search. Separate with commas.
                </p>
              </div>
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}
