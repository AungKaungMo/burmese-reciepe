import { GripVertical, Languages, ListOrdered, Plus, SlidersHorizontal, Tags, Trash2 } from 'lucide-react';
import { Controller, useFieldArray, type UseFormReturn } from 'react-hook-form';

import { useCategories } from '@/features/categories/api/queries';
import { toCategoryRow } from '@/features/categories/types';
import { ImageUploadField } from '@/features/recipes/components/image-upload-field';
import {
  RECIPE_DIFFICULTY_OPTIONS,
  RECIPE_STATUS_OPTIONS,
  SPICE_LEVEL_OPTIONS,
} from '@/features/recipes/labels';
import {
  LANGUAGES,
  SUMMARY_MAX,
  TITLE_MAX,
  emptyStep,
  type RecipeFormValues,
} from '@/features/recipes/hooks/use-recipe-form';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Checkbox } from '@/shared/components/ui/checkbox';
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

type RecipeFormFieldsProps = {
  form: UseFormReturn<RecipeFormValues>;
  cover: File | null;
  onCoverChange: (file: File | null) => void;
  currentCoverUrl?: string | null;
};

export function RecipeFormFields({
  form,
  cover,
  onCoverChange,
  currentCoverUrl,
}: RecipeFormFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <>
      <DetailsCard form={form} cover={cover} onCoverChange={onCoverChange} currentCoverUrl={currentCoverUrl} />
      <CategoriesCard form={form} />

      <Card className="flex flex-col gap-5 p-5">
        <div className="flex items-center gap-2">
          <Languages className="size-4 text-primary" />
          <div>
            <h2 className="text-base font-semibold tracking-tight">Translations</h2>
            <p className="text-xs text-muted-foreground">
              A title is required in each language. Lists accept one item per line.
            </p>
          </div>
        </div>

        {LANGUAGES.map((language) => (
          <div key={language.code} className="flex flex-col gap-4 rounded-lg border border-border p-4">
            <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {language.label}
            </span>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`title-${language.code}`}>
                Title <span className="text-primary">*</span>
              </Label>
              <Input
                id={`title-${language.code}`}
                maxLength={TITLE_MAX}
                placeholder={`Title in ${language.label}`}
                {...register(`translations.${language.code}.title`)}
              />
              {errors.translations?.[language.code]?.title && (
                <p className="text-xs text-destructive">
                  {errors.translations[language.code]?.title?.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`summary-${language.code}`}>Summary</Label>
              <Textarea
                id={`summary-${language.code}`}
                maxLength={SUMMARY_MAX}
                placeholder={`A short summary in ${language.label}...`}
                {...register(`translations.${language.code}.summary`)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`overview-${language.code}`}>Overview</Label>
              <Textarea
                id={`overview-${language.code}`}
                rows={4}
                placeholder={`Full overview in ${language.label}...`}
                {...register(`translations.${language.code}.overview`)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`good-${language.code}`}>Good to know</Label>
                <Textarea
                  id={`good-${language.code}`}
                  rows={3}
                  placeholder="One point per line"
                  {...register(`translations.${language.code}.goodToKnow`)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`serving-${language.code}`}>Serving suggestions</Label>
                <Textarea
                  id={`serving-${language.code}`}
                  rows={3}
                  placeholder="One per line"
                  {...register(`translations.${language.code}.servingSuggestions`)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`keywords-${language.code}`}>Search keywords</Label>
                <Textarea
                  id={`keywords-${language.code}`}
                  rows={3}
                  placeholder="One per line"
                  {...register(`translations.${language.code}.searchKeywords`)}
                />
              </div>
            </div>
          </div>
        ))}
      </Card>

      <StepsCard form={form} />
    </>
  );
}

function DetailsCard({
  form,
  cover,
  onCoverChange,
  currentCoverUrl,
}: RecipeFormFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <Card className="flex flex-col gap-5 p-5">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="size-4 text-primary" />
        <h2 className="text-base font-semibold tracking-tight">Recipe Details</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="recipe-slug">
            Slug <span className="text-primary">*</span>
          </Label>
          <Input id="recipe-slug" placeholder="e.g. mohinga" {...register('slug')} />
          <p className="text-xs text-muted-foreground">Unique URL key, lowercase, hyphenated.</p>
          {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="recipe-cuisine">
            Cuisine code <span className="text-primary">*</span>
          </Label>
          <Input disabled id="recipe-cuisine" placeholder="e.g. BURMESE" {...register('cuisineCode')} />
          {errors.cuisineCode && (
            <p className="text-xs text-destructive">{errors.cuisineCode.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="recipe-status">Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="recipe-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RECIPE_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="recipe-difficulty">Difficulty</Label>
            <Controller
              control={control}
              name="difficulty"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="recipe-difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RECIPE_DIFFICULTY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="recipe-spice">Spice level</Label>
            <Controller
              control={control}
              name="spiceLevel"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="recipe-spice">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SPICE_LEVEL_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="recipe-servings">Servings</Label>
            <Input
              id="recipe-servings"
              type="number"
              min={1}
              {...register('servings', { valueAsNumber: true })}
            />
            {errors.servings && (
              <p className="text-xs text-destructive">{errors.servings.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="recipe-prep">Prep (min)</Label>
            <Input
              id="recipe-prep"
              type="number"
              min={0}
              {...register('prepMinutes', { valueAsNumber: true })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="recipe-cook">Cook (min)</Label>
            <Input
              id="recipe-cook"
              type="number"
              min={0}
              {...register('cookMinutes', { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="recipe-featured">Featured</Label>
          <Controller
            control={control}
            name="isFeatured"
            render={({ field }) => (
              <div className="flex h-10 items-center gap-3 rounded-md border border-input px-3">
                <Switch
                  id="recipe-featured"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <span className="text-sm font-medium">
                  {field.value ? 'Featured' : 'Not featured'}
                </span>
              </div>
            )}
          />
        </div>
      </div>

      <ImageUploadField
        label="Cover image"
        hint="PNG, JPEG, WebP or SVG · max 5MB"
        file={cover}
        onChange={onCoverChange}
        currentUrl={currentCoverUrl}
      />
    </Card>
  );
}

function CategoriesCard({ form }: { form: UseFormReturn<RecipeFormValues> }) {
  const { data, isPending } = useCategories({ page: 1, pageSize: 100, scope: 'RECIPE' });
  const categories = (data?.items ?? []).map(toCategoryRow);

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center gap-2">
        <Tags className="size-4 text-primary" />
        <h2 className="text-base font-semibold tracking-tight">Categories</h2>
      </div>

      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading categories…</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recipe categories yet.</p>
      ) : (
        <Controller
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const checked = field.value.includes(category.id);
                return (
                  <label
                    key={category.id}
                    className="flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm hover:bg-muted/40"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(next) => {
                        field.onChange(
                          next
                            ? [...field.value, category.id]
                            : field.value.filter((id: string) => id !== category.id),
                        );
                      }}
                    />
                    <span className="truncate">{category.name}</span>
                  </label>
                );
              })}
            </div>
          )}
        />
      )}
    </Card>
  );
}

function StepsCard({ form }: { form: UseFormReturn<RecipeFormValues> }) {
  const {
    register,
    control,
    formState: { errors },
  } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'steps' });

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ListOrdered className="size-4 text-primary" />
          <h2 className="text-base font-semibold tracking-tight">Steps</h2>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => append(emptyStep())}>
          <Plus className="size-4" /> Add step
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">No steps yet. Add the first one.</p>
      )}

      {fields.map((fieldItem, index) => (
        <div key={fieldItem.id} className="flex flex-col gap-4 rounded-lg border border-border p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <GripVertical className="size-4 text-muted-foreground" />
              Step {index + 1}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label htmlFor={`step-${index}-duration`} className="text-xs text-muted-foreground">
                  Duration (min)
                </Label>
                <Input
                  id={`step-${index}-duration`}
                  type="number"
                  min={0}
                  className="w-24"
                  {...register(`steps.${index}.durationMinutes`)}
                />
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8 text-muted-foreground"
                aria-label={`Remove step ${index + 1}`}
                onClick={() => remove(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>

          {LANGUAGES.map((language) => (
            <div key={language.code} className="flex flex-col gap-3 rounded-md bg-muted/30 p-3">
              <span className="text-xs font-medium text-muted-foreground">{language.label}</span>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`step-${index}-${language.code}-instruction`}>
                  Instruction {language.code === 'MY' && <span className="text-primary">*</span>}
                </Label>
                <Textarea
                  id={`step-${index}-${language.code}-instruction`}
                  rows={2}
                  placeholder={`What to do, in ${language.label}...`}
                  {...register(`steps.${index}.translations.${language.code}.instruction`)}
                />
                {errors.steps?.[index]?.translations?.[language.code]?.instruction && (
                  <p className="text-xs text-destructive">
                    {errors.steps[index]?.translations?.[language.code]?.instruction?.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`step-${index}-${language.code}-timer`}>Timer label</Label>
                  <Input
                    id={`step-${index}-${language.code}-timer`}
                    placeholder="e.g. Simmer 10 min"
                    {...register(`steps.${index}.translations.${language.code}.timerLabel`)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`step-${index}-${language.code}-cue`}>Completion cue</Label>
                  <Input
                    id={`step-${index}-${language.code}-cue`}
                    placeholder="e.g. Broth turns golden"
                    {...register(`steps.${index}.translations.${language.code}.completionCue`)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`step-${index}-${language.code}-tip`}>Tip</Label>
                  <Input
                    id={`step-${index}-${language.code}-tip`}
                    {...register(`steps.${index}.translations.${language.code}.tip`)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`step-${index}-${language.code}-warning`}>Warning</Label>
                  <Input
                    id={`step-${index}-${language.code}-warning`}
                    {...register(`steps.${index}.translations.${language.code}.warning`)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </Card>
  );
}
