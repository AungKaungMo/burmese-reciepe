import { Controller } from 'react-hook-form';

import type { Ingredient, IngredientSubstitution } from '@repo/contracts';

import { LANGUAGES } from '@/features/categories/hooks/use-category-form';
import { useSubstitutionForm } from '@/features/ingredients/hooks/use-substitution-form';
import { Button } from '@/shared/components/ui/button';
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

type SubstituteOption = { id: string; label: string };

type SubstitutionFormCardProps = {
  originalIngredientId: string;
  /** Candidate substitute ingredients (the current ingredient is excluded). */
  options: SubstituteOption[];
  /** Present when editing an existing row; absent when adding a new one. */
  substitution?: IngredientSubstitution;
  onDone: () => void;
  onCancel: () => void;
};

export function SubstitutionFormCard({
  originalIngredientId,
  options,
  substitution,
  onDone,
  onCancel,
}: SubstitutionFormCardProps) {
  const { form, submit, isEdit, isBusy } = useSubstitutionForm({
    originalIngredientId,
    substitution,
    onDone,
  });

  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <Card className="flex flex-col gap-5 p-5">
      <h3 className="text-sm font-semibold tracking-tight">
        {isEdit ? 'Edit substitution' : 'Add substitution'}
      </h3>

      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sub-substitute">
              Substitute with <span className="text-primary">*</span>
            </Label>
            <Controller
              control={control}
              name="substituteIngredientId"
              render={({ field }) => (
                <Select value={field.value || undefined} onValueChange={field.onChange}>
                  <SelectTrigger id="sub-substitute">
                    <SelectValue placeholder="Select an ingredient" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.substituteIngredientId && (
              <p className="text-xs text-destructive">{errors.substituteIngredientId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sub-priority">Priority</Label>
              <Input
                id="sub-priority"
                type="number"
                min={0}
                {...register('priority', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">Lower shows first.</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sub-status">Status</Label>
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <div className="flex h-10 items-center gap-3 rounded-md border border-input px-3">
                    <Switch id="sub-status" checked={field.value} onCheckedChange={field.onChange} />
                    <span className="text-sm font-medium">{field.value ? 'Active' : 'Inactive'}</span>
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label>Original amount</Label>
            <div className="flex gap-2">
              <Input placeholder="e.g. 100" inputMode="decimal" {...register('originalAmount')} />
              <Input className="w-24" placeholder="unit" {...register('originalUnitCode')} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Substitute amount</Label>
            <div className="flex gap-2">
              <Input placeholder="e.g. 80" inputMode="decimal" {...register('substituteAmount')} />
              <Input className="w-24" placeholder="unit" {...register('substituteUnitCode')} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs text-muted-foreground">
            Optional notes shown to users. Leave a language blank to skip it.
          </p>
          {LANGUAGES.map((language) => (
            <div key={language.code} className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {language.label}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`sub-usage-${language.code}`}>Usage instruction</Label>
                <Textarea
                  id={`sub-usage-${language.code}`}
                  rows={2}
                  placeholder="How to use the substitute…"
                  {...register(`translations.${language.code}.usageInstruction`)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`sub-effect-${language.code}`}>Effect note</Label>
                <Textarea
                  id={`sub-effect-${language.code}`}
                  rows={2}
                  placeholder="How it changes the dish…"
                  {...register(`translations.${language.code}.effectNote`)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" disabled={isBusy} onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isBusy}>
            {isBusy ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Substitution'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

/** Builds the substitute picker options from the ingredient list, excluding `self`. */
export function toSubstituteOptions(
  ingredients: Ingredient[],
  selfId: string,
): SubstituteOption[] {
  return ingredients
    .filter((ingredient) => ingredient.id !== selfId)
    .map((ingredient) => {
      const translation =
        ingredient.translations.find((t) => t.languageCode === 'EN') ?? ingredient.translations[0];
      return { id: ingredient.id, label: translation?.name ?? ingredient.code };
    });
}
