import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import {
  ingredientSchema,
  ingredientTranslationSchema,
  type CreateIngredientInput,
  type Ingredient,
  type LanguageCode,
} from '@repo/contracts';

import { useCreateIngredient, useUpdateIngredient } from '@/features/ingredients/api/queries';
import { LANGUAGES } from '@/features/categories/hooks/use-category-form';
import { uploadFile } from '@/shared/lib/upload';

/** Splits a comma-separated aliases input into a trimmed, non-empty string array. */
function parseAliases(value: string): string[] {
  return value
    .split(',')
    .map((alias) => alias.trim())
    .filter(Boolean);
}

const translationFieldSchema = z.object({
  name: ingredientTranslationSchema.shape.name,
  // Aliases are edited as a single comma-separated string, split on submit.
  aliases: z.string(),
});

export const ingredientFormSchema = z.object({
  code: ingredientSchema.shape.code,
  categoryId: ingredientSchema.shape.categoryId,
  emoji: z.string(),
  isActive: ingredientSchema.shape.isActive,
  translations: z.object({
    MY: translationFieldSchema,
    EN: translationFieldSchema,
  }),
});

export type IngredientFormValues = z.infer<typeof ingredientFormSchema>;

const EMPTY_VALUES: IngredientFormValues = {
  code: '',
  categoryId: '',
  emoji: '',
  isActive: true,
  translations: {
    MY: { name: '', aliases: '' },
    EN: { name: '', aliases: '' },
  },
};

/** Flattens a contract `Ingredient` into the form's per-language shape. */
function toFormValues(ingredient: Ingredient): IngredientFormValues {
  const find = (code: LanguageCode) =>
    ingredient.translations.find((t) => t.languageCode === code);

  return {
    code: ingredient.code,
    categoryId: ingredient.categoryId,
    emoji: ingredient.emoji ?? '',
    isActive: ingredient.isActive,
    translations: {
      MY: { name: find('MY')?.name ?? '', aliases: find('MY')?.aliases.join(', ') ?? '' },
      EN: { name: find('EN')?.name ?? '', aliases: find('EN')?.aliases.join(', ') ?? '' },
    },
  };
}

/**
 * Owns the create/edit ingredient flow: form state/validation, the light/dark icon
 * files + their uploads, and the create-or-update mutation. When `ingredient` is
 * provided the form seeds from it and submits an update; otherwise it creates. On
 * success it navigates back to the list. The page consumes this and stays presentational.
 */
export function useIngredientForm(ingredient?: Ingredient) {
  const navigate = useNavigate();
  const createIngredient = useCreateIngredient();
  const updateIngredient = useUpdateIngredient();
  const isEdit = Boolean(ingredient);
  const mutation = ingredient ? updateIngredient : createIngredient;

  const [icon, setIcon] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientFormSchema),
    defaultValues: ingredient ? toFormValues(ingredient) : EMPTY_VALUES,
  });

  const { reset } = form;
  // The edit page fetches the ingredient asynchronously — reseed once it arrives.
  useEffect(() => {
    if (ingredient) reset(toFormValues(ingredient));
  }, [ingredient, reset]);

  const submit = form.handleSubmit(async (values) => {
    setUploadError(null);

    // Keep the existing icon unless a new file was picked; upload replacements to R2.
    let iconPath: string | null = ingredient?.iconPath ?? null;
    if (icon) {
      try {
        setIsUploading(true);
        iconPath = await uploadFile(icon, 'ingredients');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to upload icon.';
        setUploadError(message);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const payload: CreateIngredientInput = {
      code: values.code,
      categoryId: values.categoryId,
      emoji: values.emoji.trim() ? values.emoji.trim() : null,
      iconPath,
      isActive: values.isActive,
      translations: LANGUAGES.map(({ code }) => ({
        languageCode: code,
        name: values.translations[code].name,
        aliases: parseAliases(values.translations[code].aliases),
      })),
    };

    const onSuccess = () => navigate('/ingredients');
    if (ingredient) {
      updateIngredient.mutate({ id: ingredient.id, input: payload }, { onSuccess });
    } else {
      createIngredient.mutate(payload, { onSuccess });
    }
  });

  const errorMessage =
    uploadError ??
    (mutation.isError
      ? mutation.error instanceof Error
        ? mutation.error.message
        : `Failed to ${isEdit ? 'update' : 'create'} ingredient.`
      : null);

  return {
    form,
    submit,
    icon,
    setIcon,
    currentIconUrl: ingredient?.iconPath ?? null,
    isEdit,
    isUploading,
    isBusy: isUploading || mutation.isPending,
    isSaving: mutation.isPending,
    errorMessage,
  };
}
