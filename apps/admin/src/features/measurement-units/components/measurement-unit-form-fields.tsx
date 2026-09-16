import { Languages, SlidersHorizontal } from 'lucide-react';
import { type UseFormReturn } from 'react-hook-form';

import {
  LANGUAGES,
  type MeasurementUnitFormValues,
} from '@/features/measurement-units/hooks/use-measurement-unit-form';
import { Card } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

type MeasurementUnitFormFieldsProps = {
  form: UseFormReturn<MeasurementUnitFormValues>;
};

/** Shared Details + Translations fields, used by both the create and edit pages. */
export function MeasurementUnitFormFields({ form }: MeasurementUnitFormFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <>
      <Card className="flex flex-col gap-5 p-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-primary" />
          <h2 className="text-base font-semibold tracking-tight">Unit Details</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="unit-code">
              Code <span className="text-primary">*</span>
            </Label>
            <Input id="unit-code" placeholder="e.g. g, ml, tbsp" {...register('code')} />
            <p className="text-xs text-muted-foreground">Stable machine key (e.g. g, ml).</p>
            {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="unit-symbol">
              Symbol <span className="text-primary">*</span>
            </Label>
            <Input id="unit-symbol" placeholder="e.g. g, mℓ" {...register('symbol')} />
            <p className="text-xs text-muted-foreground">Display glyph shown to users.</p>
            {errors.symbol && <p className="text-xs text-destructive">{errors.symbol.message}</p>}
          </div>
        </div>
      </Card>

      <Card className="flex flex-col gap-5 p-5">
        <div className="flex items-center gap-2">
          <Languages className="size-4 text-primary" />
          <div>
            <h2 className="text-base font-semibold tracking-tight">Translations</h2>
            <p className="text-xs text-muted-foreground">
              Provide the unit name and short label in each language.
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
                  placeholder={`e.g. Gram in ${language.label}`}
                  {...register(`translations.${language.code}.name`)}
                />
                {errors.translations?.[language.code]?.name && (
                  <p className="text-xs text-destructive">
                    {errors.translations[language.code]?.name?.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`short-${language.code}`}>
                  Short label <span className="text-primary">*</span>
                </Label>
                <Input
                  id={`short-${language.code}`}
                  placeholder="e.g. g"
                  {...register(`translations.${language.code}.shortLabel`)}
                />
                {errors.translations?.[language.code]?.shortLabel && (
                  <p className="text-xs text-destructive">
                    {errors.translations[language.code]?.shortLabel?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}
