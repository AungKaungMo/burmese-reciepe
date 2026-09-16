import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  nutrientSchema,
  nutrientTranslationSchema,
  type CreateNutrientInput,
  type Nutrient,
} from '@repo/contracts';

import { useCreateNutrient, useUpdateNutrient } from '@/features/nutrients/api/queries';
import { uploadFile } from '@/shared/lib/upload';

export const LANGUAGES: { code: 'MY' | 'EN'; label: string }[] = [
  { code: 'MY', label: 'Myanmar' },
  { code: 'EN', label: 'English (EN)' },
];

// The form shape is UI-specific (translations keyed by language), but every field
// rule is sourced from the contract so the admin never drifts from the API.
const translationFieldSchema = z.object({
  name: nutrientTranslationSchema.shape.name,
  description: nutrientTranslationSchema.shape.description.unwrap(),
});

export const nutrientFormSchema = z.object({
  code: nutrientSchema.shape.code,
  defaultUnitId: nutrientSchema.shape.defaultUnitId,
  translations: z.object({
    MY: translationFieldSchema,
    EN: translationFieldSchema,
  }),
});

export type NutrientFormValues = z.infer<typeof nutrientFormSchema>;

const EMPTY_VALUES: NutrientFormValues = {
  code: '',
  defaultUnitId: '',
  translations: {
    MY: { name: '', description: '' },
    EN: { name: '', description: '' },
  },
};

function toFormValues(nutrient: Nutrient): NutrientFormValues {
  const find = (code: string) => nutrient.translations.find((t) => t.languageCode === code);

  return {
    code: nutrient.code,
    defaultUnitId: nutrient.defaultUnitId,
    translations: {
      MY: { name: find('MY')?.name ?? '', description: find('MY')?.description ?? '' },
      EN: { name: find('EN')?.name ?? '', description: find('EN')?.description ?? '' },
    },
  };
}

/**
 * Owns the create/edit nutrient flow: form state/validation, the icon file + its
 * upload, and the create-or-update mutation. When `nutrient` is provided the form
 * seeds from it and submits an update; otherwise it creates. On success it returns
 * to the list.
 */
export function useNutrientForm(nutrient?: Nutrient) {
  const navigate = useNavigate();
  const createNutrient = useCreateNutrient();
  const updateNutrient = useUpdateNutrient();
  const isEdit = Boolean(nutrient);
  const mutation = nutrient ? updateNutrient : createNutrient;

  const [icon, setIcon] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const form = useForm<NutrientFormValues>({
    resolver: zodResolver(nutrientFormSchema),
    defaultValues: nutrient ? toFormValues(nutrient) : EMPTY_VALUES,
  });

  const { reset } = form;
  useEffect(() => {
    if (nutrient) reset(toFormValues(nutrient));
  }, [nutrient, reset]);

  const submit = form.handleSubmit(async (values) => {
    setUploadError(null);

    // Keep the existing icon unless a new file was picked; upload replacements to R2.
    let iconPath: string | null = nutrient?.iconPath ?? null;
    if (icon) {
      try {
        setIsUploading(true);
        iconPath = await uploadFile(icon, 'nutrients');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to upload icon.';
        setUploadError(message);
        toast.error(message);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const payload: CreateNutrientInput = {
      code: values.code,
      defaultUnitId: values.defaultUnitId,
      iconPath,
      translations: LANGUAGES.map(({ code }) => ({
        languageCode: code,
        name: values.translations[code].name,
        description: values.translations[code].description.trim()
          ? values.translations[code].description
          : null,
      })),
    };

    const onSuccess = () => navigate('/nutrients');
    if (nutrient) {
      updateNutrient.mutate({ id: nutrient.id, input: payload }, { onSuccess });
    } else {
      createNutrient.mutate(payload, { onSuccess });
    }
  });

  const errorMessage =
    uploadError ??
    (mutation.isError
      ? mutation.error instanceof Error
        ? mutation.error.message
        : `Failed to ${isEdit ? 'update' : 'create'} nutrient.`
      : null);

  return {
    form,
    submit,
    icon,
    setIcon,
    currentIconUrl: nutrient?.iconPath ?? null,
    isEdit,
    isUploading,
    isBusy: isUploading || mutation.isPending,
    isSaving: mutation.isPending,
    errorMessage,
  };
}
