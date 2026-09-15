import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type {
  CreateIngredientSubstitutionInput,
  IngredientSubstitution,
  LanguageCode,
} from '@repo/contracts';

import {
  useCreateSubstitution,
  useUpdateSubstitution,
} from '@/features/ingredients/api/substitution-queries';
import { LANGUAGES } from '@/features/categories/hooks/use-category-form';

/** Parses an amount text field into a non-negative number, or `null` when blank/invalid. */
function parseAmount(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function toText(value: number | null): string {
  return value == null ? '' : String(value);
}

const noteFieldSchema = z.object({
  usageInstruction: z.string(),
  effectNote: z.string(),
});

export const substitutionFormSchema = z.object({
  substituteIngredientId: z.uuid('Select a substitute ingredient.'),
  priority: z.number().int().nonnegative(),
  isActive: z.boolean(),
  originalAmount: z.string(),
  originalUnitCode: z.string(),
  substituteAmount: z.string(),
  substituteUnitCode: z.string(),
  translations: z.object({
    MY: noteFieldSchema,
    EN: noteFieldSchema,
  }),
});

export type SubstitutionFormValues = z.infer<typeof substitutionFormSchema>;

const EMPTY_VALUES: SubstitutionFormValues = {
  substituteIngredientId: '',
  priority: 0,
  isActive: true,
  originalAmount: '',
  originalUnitCode: '',
  substituteAmount: '',
  substituteUnitCode: '',
  translations: {
    MY: { usageInstruction: '', effectNote: '' },
    EN: { usageInstruction: '', effectNote: '' },
  },
};

function toFormValues(substitution: IngredientSubstitution): SubstitutionFormValues {
  const find = (code: LanguageCode) =>
    substitution.translations.find((t) => t.languageCode === code);

  return {
    substituteIngredientId: substitution.substituteIngredientId,
    priority: substitution.priority,
    isActive: substitution.isActive,
    originalAmount: toText(substitution.originalAmount),
    originalUnitCode: substitution.originalUnitCode ?? '',
    substituteAmount: toText(substitution.substituteAmount),
    substituteUnitCode: substitution.substituteUnitCode ?? '',
    translations: {
      MY: {
        usageInstruction: find('MY')?.usageInstruction ?? '',
        effectNote: find('MY')?.effectNote ?? '',
      },
      EN: {
        usageInstruction: find('EN')?.usageInstruction ?? '',
        effectNote: find('EN')?.effectNote ?? '',
      },
    },
  };
}

/**
 * Owns a single substitution's create/edit flow for a given original ingredient.
 * When `substitution` is provided the form seeds from it and submits an update;
 * otherwise it creates. On success it calls `onDone` (the panel resets its editor).
 */
export function useSubstitutionForm({
  originalIngredientId,
  substitution,
  onDone,
}: {
  originalIngredientId: string;
  substitution?: IngredientSubstitution;
  onDone: () => void;
}) {
  const createSubstitution = useCreateSubstitution();
  const updateSubstitution = useUpdateSubstitution();
  const isEdit = Boolean(substitution);
  const mutation = substitution ? updateSubstitution : createSubstitution;

  const form = useForm<SubstitutionFormValues>({
    resolver: zodResolver(substitutionFormSchema),
    defaultValues: substitution ? toFormValues(substitution) : EMPTY_VALUES,
  });

  const { reset } = form;
  useEffect(() => {
    reset(substitution ? toFormValues(substitution) : EMPTY_VALUES);
  }, [substitution, reset]);

  const submit = form.handleSubmit((values) => {
    // Keep only languages that actually have a note; a blank language is omitted.
    const translations = LANGUAGES.map(({ code }) => {
      const usage = values.translations[code].usageInstruction.trim();
      const effect = values.translations[code].effectNote.trim();
      if (!usage && !effect) return null;
      return {
        languageCode: code,
        usageInstruction: usage || null,
        effectNote: effect || null,
      };
    }).filter((t): t is NonNullable<typeof t> => t !== null);

    const payload: CreateIngredientSubstitutionInput = {
      originalIngredientId,
      substituteIngredientId: values.substituteIngredientId,
      originalAmount: parseAmount(values.originalAmount),
      originalUnitCode: values.originalUnitCode.trim() || null,
      substituteAmount: parseAmount(values.substituteAmount),
      substituteUnitCode: values.substituteUnitCode.trim() || null,
      priority: values.priority,
      isActive: values.isActive,
      translations,
    };

    const onSuccess = () => onDone();
    if (substitution) {
      updateSubstitution.mutate({ id: substitution.id, input: payload }, { onSuccess });
    } else {
      createSubstitution.mutate(payload, { onSuccess });
    }
  });

  return {
    form,
    submit,
    isEdit,
    isBusy: mutation.isPending,
  };
}
