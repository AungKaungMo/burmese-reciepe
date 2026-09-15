import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  categorySchema,
  categoryScopeSchema,
  categoryTranslationSchema,
  type Category,
  type CreateCategoryInput,
  type LanguageCode,
} from '@repo/contracts';

import { useCreateCategory, useUpdateCategory } from '@/features/categories/api/queries';
import { uploadFile } from '@/shared/lib/upload';

// The contract caps descriptions at 2000; surface it for the Textarea's maxLength.
export const DESCRIPTION_MAX = categoryTranslationSchema.shape.description.unwrap().maxLength ?? 2000;

export const LANGUAGES: { code: Extract<LanguageCode, 'MY' | 'EN'>; label: string }[] = [
  { code: 'MY', label: 'Myanmar' },
  { code: 'EN', label: 'English (EN)' },
];

const translationFieldSchema = z.object({
  name: categoryTranslationSchema.shape.name,
  description: categoryTranslationSchema.shape.description.unwrap(),
});

export const categoryFormSchema = z.object({
  scope: categoryScopeSchema,
  code: categorySchema.shape.code,
  sortOrder: categorySchema.shape.sortOrder,
  isActive: categorySchema.shape.isActive,
  translations: z.object({
    MY: translationFieldSchema,
    EN: translationFieldSchema,
  }),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

const EMPTY_VALUES: CategoryFormValues = {
  scope: 'RECIPE',
  code: '',
  sortOrder: 0,
  isActive: true,
  translations: {
    MY: { name: '', description: '' },
    EN: { name: '', description: '' },
  },
};

/** Flattens a contract `Category` into the form's per-language shape. */
function toFormValues(category: Category): CategoryFormValues {
  const find = (code: LanguageCode) =>
    category.translations.find((t) => t.languageCode === code);

  return {
    scope: category.scope,
    code: category.code,
    sortOrder: category.sortOrder,
    isActive: category.isActive,
    translations: {
      MY: { name: find('MY')?.name ?? '', description: find('MY')?.description ?? '' },
      EN: { name: find('EN')?.name ?? '', description: find('EN')?.description ?? '' },
    },
  };
}

/**
 * Owns the create/edit category flow: form state/validation, the icon file + its
 * upload, and the create-or-update mutation. When `category` is provided the form
 * seeds from it and submits an update; otherwise it creates. On success it
 * navigates back to the list. The page consumes this and stays presentational.
 */
export function useCategoryForm(category?: Category) {
  const navigate = useNavigate();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const isEdit = Boolean(category);
  const mutation = category ? updateCategory : createCategory;

  const [icon, setIcon] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: category ? toFormValues(category) : EMPTY_VALUES,
  });

  const { reset } = form;
  // The edit page fetches the category asynchronously — reseed once it arrives.
  useEffect(() => {
    if (category) reset(toFormValues(category));
  }, [category, reset]);

  const submit = form.handleSubmit(async (values) => {
    setUploadError(null);

    // Keep the existing icon unless a new file was picked; upload replacements to R2.
    let iconPath: string | null = category?.iconPath ?? null;
    if (icon) {
      try {
        setIsUploading(true);
        iconPath = await uploadFile(icon, 'categories');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to upload icon.';
        setUploadError(message);
        toast.error(message);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const payload: CreateCategoryInput = {
      scope: values.scope,
      code: values.code,
      iconPath,
      sortOrder: values.sortOrder,
      isActive: values.isActive,
      translations: LANGUAGES.map(({ code }) => ({
        languageCode: code,
        name: values.translations[code].name,
        description: values.translations[code].description.trim()
          ? values.translations[code].description
          : null,
      })),
    };

    const onSuccess = () => navigate('/categories');
    if (category) {
      updateCategory.mutate({ id: category.id, input: payload }, { onSuccess });
    } else {
      createCategory.mutate(payload, { onSuccess });
    }
  });

  const errorMessage =
    uploadError ??
    (mutation.isError
      ? mutation.error instanceof Error
        ? mutation.error.message
        : `Failed to ${isEdit ? 'update' : 'create'} category.`
      : null);

  return {
    form,
    submit,
    icon,
    setIcon,
    currentIconUrl: category?.iconPath ?? null,
    isEdit,
    isUploading,
    isBusy: isUploading || mutation.isPending,
    isSaving: mutation.isPending,
    errorMessage,
  };
}
