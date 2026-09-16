import { Carrot, GripVertical, Languages, ListOrdered, Plus, SlidersHorizontal, Tags, Trash2 } from 'lucide-react';
import { Controller, useFieldArray, type UseFormReturn } from 'react-hook-form';

import type { Ingredient, MeasurementUnit } from '@repo/contracts';

import { useCategories } from '@/features/categories/api/queries';
import { toCategoryRow } from '@/features/categories/types';
import { useAllIngredients } from '@/features/ingredients/api/queries';
import { useAllMeasurementUnits } from '@/features/measurement-units/api/queries';
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
  emptyRecipeIngredient,
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

type DetailsCardProps = {
  form: UseFormReturn<RecipeFormValues>;
  cover: File | null;
  onCoverChange: (file: File | null) => void;
  currentCoverUrl?: string | null;
};

/** Localized text fields (title/summary/overview + list fields) per language. */
export function TranslationsCard({ form }: { form: UseFormReturn<RecipeFormValues> }) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
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
  );
}

/** EN-first display label for the ingredient picker. */
function ingredientLabel(ingredient: Ingredient): string {
  const t = ingredient.translations.find((item) => item.languageCode === 'EN') ?? ingredient.translations[0];
  return t?.name ?? ingredient.code;
}

/** EN-first display label for the unit picker, e.g. "Gram (g)". */
function unitLabel(unit: MeasurementUnit): string {
  const t = unit.translations.find((item) => item.languageCode === 'EN') ?? unit.translations[0];
  return t?.name ? `${t.name} (${unit.symbol})` : unit.symbol;
}

/** Sentinel for "no unit" — Radix Select items can't hold an empty string value. */
const NO_UNIT = '__none__';

export function IngredientsCard({ form }: { form: UseFormReturn<RecipeFormValues> }) {
  const {
    control,
    register,
    formState: { errors },
  } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'recipeIngredients' });

  const { data: ingredients = [] } = useAllIngredients();
  const { data: units = [] } = useAllMeasurementUnits();

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Carrot className="size-4 text-primary" />
          <h2 className="text-base font-semibold tracking-tight">Ingredients</h2>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append(emptyRecipeIngredient())}
        >
          <Plus className="size-4" /> Add ingredient
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">No ingredients yet. Add the first one.</p>
      )}

      {fields.map((fieldItem, index) => (
        <div key={fieldItem.id} className="flex flex-col gap-4 rounded-lg border border-border p-4">
          <div className="flex items-start gap-3">
            <GripVertical className="mt-2.5 size-4 shrink-0 text-muted-foreground" />

            <div className="grid flex-1 gap-3 sm:grid-cols-[2fr_1fr_1.5fr_auto]">
              {/* Ingredient picker */}
              <div className="flex flex-col gap-1.5">
                <Label>
                  Ingredient <span className="text-primary">*</span>
                </Label>
                <Controller
                  control={control}
                  name={`recipeIngredients.${index}.ingredientId`}
                  render={({ field }) => (
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ingredient" />
                      </SelectTrigger>
                      <SelectContent>
                        {ingredients.map((ingredient) => (
                          <SelectItem key={ingredient.id} value={ingredient.id}>
                            {ingredientLabel(ingredient)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.recipeIngredients?.[index]?.ingredientId && (
                  <p className="text-xs text-destructive">
                    {errors.recipeIngredients[index]?.ingredientId?.message}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`ri-${index}-qty`}>Quantity</Label>
                <Input
                  id={`ri-${index}-qty`}
                  inputMode="decimal"
                  placeholder="e.g. 150"
                  {...register(`recipeIngredients.${index}.quantity`)}
                />
                {errors.recipeIngredients?.[index]?.quantity && (
                  <p className="text-xs text-destructive">
                    {errors.recipeIngredients[index]?.quantity?.message}
                  </p>
                )}
              </div>

              {/* Unit */}
              <div className="flex flex-col gap-1.5">
                <Label>Unit</Label>
                <Controller
                  control={control}
                  name={`recipeIngredients.${index}.unitId`}
                  render={({ field }) => (
                    <Select
                      value={field.value || NO_UNIT}
                      onValueChange={(value) => field.onChange(value === NO_UNIT ? '' : value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NO_UNIT}>No unit</SelectItem>
                        {units.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unitLabel(unit)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Remove */}
              <div className="flex items-end">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-9 text-muted-foreground"
                  aria-label={`Remove ingredient ${index + 1}`}
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pl-7">
            <Controller
              control={control}
              name={`recipeIngredients.${index}.isOptional`}
              render={({ field }) => (
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                  <span className="text-muted-foreground">Optional</span>
                </label>
              )}
            />
          </div>

          {/* Localized notes */}
          <div className="grid gap-3 pl-7 sm:grid-cols-2">
            {LANGUAGES.map((language) => (
              <div key={language.code} className="flex flex-col gap-2 rounded-md bg-muted/30 p-3">
                <span className="text-xs font-medium text-muted-foreground">{language.label}</span>
                <Input
                  placeholder="Preparation note (e.g. finely chopped)"
                  {...register(`recipeIngredients.${index}.notes.${language.code}.preparationNote`)}
                />
                <Input
                  placeholder="Amount note (e.g. about 1 large)"
                  {...register(`recipeIngredients.${index}.notes.${language.code}.amountNote`)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </Card>
  );
}

export function DetailsCard({
  form,
  cover,
  onCoverChange,
  currentCoverUrl,
}: DetailsCardProps) {
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

export function CategoriesCard({ form }: { form: UseFormReturn<RecipeFormValues> }) {
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

export function StepsCard({ form }: { form: UseFormReturn<RecipeFormValues> }) {
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
