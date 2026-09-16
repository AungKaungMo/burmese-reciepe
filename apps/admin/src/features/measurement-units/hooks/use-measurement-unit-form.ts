import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import {
  measurementUnitSchema,
  measurementUnitTranslationSchema,
  type CreateMeasurementUnitInput,
  type MeasurementUnit,
} from '@repo/contracts';

import {
  useCreateMeasurementUnit,
  useUpdateMeasurementUnit,
} from '@/features/measurement-units/api/queries';

export const LANGUAGES: { code: 'MY' | 'EN'; label: string }[] = [
  { code: 'MY', label: 'Myanmar' },
  { code: 'EN', label: 'English (EN)' },
];

// The form shape is UI-specific (translations keyed by language), but every field
// rule is sourced from the contract so the admin never drifts from the API.
const translationFieldSchema = z.object({
  name: measurementUnitTranslationSchema.shape.name,
  shortLabel: measurementUnitTranslationSchema.shape.shortLabel,
});

export const measurementUnitFormSchema = z.object({
  code: measurementUnitSchema.shape.code,
  symbol: measurementUnitSchema.shape.symbol,
  translations: z.object({
    MY: translationFieldSchema,
    EN: translationFieldSchema,
  }),
});

export type MeasurementUnitFormValues = z.infer<typeof measurementUnitFormSchema>;

const EMPTY_VALUES: MeasurementUnitFormValues = {
  code: '',
  symbol: '',
  translations: {
    MY: { name: '', shortLabel: '' },
    EN: { name: '', shortLabel: '' },
  },
};

function toFormValues(unit: MeasurementUnit): MeasurementUnitFormValues {
  const find = (code: string) => unit.translations.find((t) => t.languageCode === code);

  return {
    code: unit.code,
    symbol: unit.symbol,
    translations: {
      MY: { name: find('MY')?.name ?? '', shortLabel: find('MY')?.shortLabel ?? '' },
      EN: { name: find('EN')?.name ?? '', shortLabel: find('EN')?.shortLabel ?? '' },
    },
  };
}

export function useMeasurementUnitForm(unit?: MeasurementUnit) {
  const navigate = useNavigate();
  const createUnit = useCreateMeasurementUnit();
  const updateUnit = useUpdateMeasurementUnit();
  const isEdit = Boolean(unit);
  const mutation = unit ? updateUnit : createUnit;

  const form = useForm<MeasurementUnitFormValues>({
    resolver: zodResolver(measurementUnitFormSchema),
    defaultValues: unit ? toFormValues(unit) : EMPTY_VALUES,
  });

  const { reset } = form;
  useEffect(() => {
    if (unit) reset(toFormValues(unit));
  }, [unit, reset]);

  const submit = form.handleSubmit((values) => {
    const payload: CreateMeasurementUnitInput = {
      code: values.code,
      symbol: values.symbol,
      translations: LANGUAGES.map(({ code }) => ({
        languageCode: code,
        name: values.translations[code].name,
        shortLabel: values.translations[code].shortLabel,
      })),
    };

    const onSuccess = () => navigate('/measurement-units');
    if (unit) {
      updateUnit.mutate({ id: unit.id, input: payload }, { onSuccess });
    } else {
      createUnit.mutate(payload, { onSuccess });
    }
  });

  const errorMessage = mutation.isError
    ? mutation.error instanceof Error
      ? mutation.error.message
      : `Failed to ${isEdit ? 'update' : 'create'} measurement unit.`
    : null;

  return {
    form,
    submit,
    isEdit,
    isBusy: mutation.isPending,
    isSaving: mutation.isPending,
    errorMessage,
  };
}
