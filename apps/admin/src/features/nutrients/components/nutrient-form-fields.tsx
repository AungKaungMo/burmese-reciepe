import { Languages, SlidersHorizontal } from 'lucide-react';
import { Controller, type UseFormReturn } from 'react-hook-form';

import { SvgUploadField } from '@/shared/components/svg-upload-field';
import { useAllMeasurementUnits } from '@/features/measurement-units/api/queries';
import { toMeasurementUnitRow } from '@/features/measurement-units/mappers';
import { LANGUAGES, type NutrientFormValues } from '@/features/nutrients/hooks/use-nutrient-form';
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
import { Textarea } from '@/shared/components/ui/textarea';

type NutrientFormFieldsProps = {
  form: UseFormReturn<NutrientFormValues>;
  icon: File | null;
  onIconChange: (file: File | null) => void;
  currentIconUrl?: string | null;
};

/** Shared Details + Translations fields, used by both the create and edit pages. */
export function NutrientFormFields({
  form,
  icon,
  onIconChange,
  currentIconUrl,
}: NutrientFormFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const { data: units, isPending: unitsLoading } = useAllMeasurementUnits();
  const unitOptions = (units ?? []).map(toMeasurementUnitRow);

  return (
    <>
      <Card className="flex flex-col gap-5 p-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-primary" />
          <h2 className="text-base font-semibold tracking-tight">Nutrient Details</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nutrient-code">
              Code <span className="text-primary">*</span>
            </Label>
            <Input id="nutrient-code" placeholder="e.g. PROTEIN" {...register('code')} />
            <p className="text-xs text-muted-foreground">Stable machine key (e.g. PROTEIN).</p>
            {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nutrient-unit">
              Default unit <span className="text-primary">*</span>
            </Label>
            <Controller
              control={control}
              name="defaultUnitId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={unitsLoading}>
                  <SelectTrigger id="nutrient-unit">
                    <SelectValue placeholder={unitsLoading ? 'Loading units…' : 'Select a unit'} />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name} ({unit.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-xs text-muted-foreground">The unit amounts are measured in.</p>
            {errors.defaultUnitId && (
              <p className="text-xs text-destructive">{errors.defaultUnitId.message}</p>
            )}
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
              Provide the nutrient name and an optional description in each language.
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
