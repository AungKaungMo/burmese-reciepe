import { Languages, SlidersHorizontal } from 'lucide-react';
import { Controller, type UseFormReturn } from 'react-hook-form';

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
import { Textarea } from '@/shared/components/ui/textarea';
import { SvgUploadField } from '@/features/categories/components/svg-upload-field';
import {
  DESCRIPTION_MAX,
  LANGUAGES,
  type CategoryFormValues,
} from '@/features/categories/hooks/use-category-form';

type CategoryFormFieldsProps = {
  form: UseFormReturn<CategoryFormValues>;
  icon: File | null;
  onIconChange: (file: File | null) => void;
  currentIconUrl?: string | null;
};

/** Shared Details + Translations fields, used by both the create and edit pages. */
export function CategoryFormFields({
  form,
  icon,
  onIconChange,
  currentIconUrl,
}: CategoryFormFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <>
      <Card className="flex flex-col gap-5 p-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-primary" />
          <h2 className="text-base font-semibold tracking-tight">Category Details</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category-scope">
              Scope <span className="text-primary">*</span>
            </Label>
            <Controller
              control={control}
              name="scope"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="category-scope">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RECIPE">Recipe</SelectItem>
                    <SelectItem value="INGREDIENT">Ingredient</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category-code">
              Code <span className="text-primary">*</span>
            </Label>
            <Input id="category-code" placeholder="e.g. main-dishes" {...register('code')} />
            <p className="text-xs text-muted-foreground">
              Unique machine key, lowercase, hyphenated (e.g. main-dishes).
            </p>
            {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category-sort-order">Sort Order</Label>
            <Input
              id="category-sort-order"
              type="number"
              min={0}
              {...register('sortOrder', { valueAsNumber: true })}
            />
            <p className="text-xs text-muted-foreground">Lower numbers appear first.</p>
            {errors.sortOrder && <p className="text-xs text-destructive">{errors.sortOrder.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category-status">Status</Label>
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <div className="flex h-10 items-center gap-3 rounded-md border border-input px-3">
                  <Switch id="category-status" checked={field.value} onCheckedChange={field.onChange} />
                  <span className="text-sm font-medium">{field.value ? 'Active' : 'Inactive'}</span>
                </div>
              )}
            />
            <p className="text-xs text-muted-foreground">Inactive categories are not shown to users.</p>
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
              Add names and descriptions in different languages. At least one translation is required.
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
                <Label htmlFor={`description-${language.code}`}>Description</Label>
                <Textarea
                  id={`description-${language.code}`}
                  maxLength={DESCRIPTION_MAX}
                  placeholder={`A short description in ${language.label}...`}
                  {...register(`translations.${language.code}.description`)}
                />
              </div>
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}
