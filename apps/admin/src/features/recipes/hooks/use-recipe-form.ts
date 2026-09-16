import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import {
  recipeDifficultySchema,
  recipeSchema,
  recipeStatusSchema,
  recipeTranslationSchema,
  spiceLevelSchema,
  type CreateRecipeInput,
  type LanguageCode,
  type Recipe,
} from '@repo/contracts';

import { useCreateRecipe, useUpdateRecipe } from '@/features/recipes/api/queries';
import { uploadFile } from '@/shared/lib/upload';

export const LANGUAGES: { code: Extract<LanguageCode, 'MY' | 'EN'>; label: string }[] = [
  { code: 'MY', label: 'Myanmar' },
  { code: 'EN', label: 'English (EN)' },
];

export const TITLE_MAX = recipeTranslationSchema.shape.title.maxLength ?? 160;
export const SUMMARY_MAX = recipeTranslationSchema.shape.summary.unwrap().maxLength ?? 300;

// Translation fields as the form holds them: `title` reuses the contract rule; the
// nullable text fields become plain strings (mapped empty → null on submit) and the
// string arrays are edited as newline-separated text.
const translationFieldSchema = z.object({
  title: recipeTranslationSchema.shape.title,
  summary: z.string(),
  overview: z.string(),
  goodToKnow: z.string(),
  servingSuggestions: z.string(),
  searchKeywords: z.string(),
});

const stepTranslationFieldSchema = z.object({
  instruction: z.string(),
  timerLabel: z.string(),
  completionCue: z.string(),
  tip: z.string(),
  warning: z.string(),
});

const stepFieldSchema = z.object({
  durationMinutes: z.string(),
  translations: z.object({
    MY: stepTranslationFieldSchema,
    EN: stepTranslationFieldSchema,
  }),
});

// An ingredient row as the form holds it: the picked ingredient/unit ids, a text
// `quantity` (empty → null), and per-language notes (mapped empty → null on submit).
const ingredientNoteFieldSchema = z.object({
  preparationNote: z.string(),
  amountNote: z.string(),
});

const recipeIngredientFieldSchema = z.object({
  ingredientId: z.uuid('Select an ingredient.'),
  unitId: z.string(),
  quantity: z
    .string()
    .refine(
      (value) => value.trim() === '' || (!Number.isNaN(Number(value)) && Number(value) >= 0),
      'Enter a valid amount.',
    ),
  isOptional: z.boolean(),
  notes: z.object({
    MY: ingredientNoteFieldSchema,
    EN: ingredientNoteFieldSchema,
  }),
});

export const recipeFormSchema = z
  .object({
    slug: recipeSchema.shape.slug,
    status: recipeStatusSchema,
    cuisineCode: recipeSchema.shape.cuisineCode,
    servings: recipeSchema.shape.servings,
    prepMinutes: recipeSchema.shape.prepMinutes,
    cookMinutes: recipeSchema.shape.cookMinutes,
    difficulty: recipeDifficultySchema,
    spiceLevel: spiceLevelSchema,
    isFeatured: recipeSchema.shape.isFeatured,
    categoryIds: z.array(z.string()),
    translations: z.object({
      MY: translationFieldSchema,
      EN: translationFieldSchema,
    }),
    steps: z.array(stepFieldSchema),
    recipeIngredients: z.array(recipeIngredientFieldSchema),
  })
  .superRefine((values, ctx) => {
    // Myanmar is the primary language, so every step must carry an MY instruction;
    // the English instruction is optional and only sent when filled.
    values.steps.forEach((step, index) => {
      if (!step.translations.MY.instruction.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Instruction (Myanmar) is required.',
          path: ['steps', index, 'translations', 'MY', 'instruction'],
        });
      }
    });
  });

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;

const EMPTY_TRANSLATION = {
  title: '',
  summary: '',
  overview: '',
  goodToKnow: '',
  servingSuggestions: '',
  searchKeywords: '',
};

const EMPTY_VALUES: RecipeFormValues = {
  slug: '',
  status: 'DRAFT',
  cuisineCode: 'BURMESE',
  servings: 1,
  prepMinutes: 0,
  cookMinutes: 0,
  difficulty: 'EASY',
  spiceLevel: 'MILD',
  isFeatured: false,
  categoryIds: [],
  translations: { MY: { ...EMPTY_TRANSLATION }, EN: { ...EMPTY_TRANSLATION } },
  steps: [],
  recipeIngredients: [],
};

export function emptyRecipeIngredient(): RecipeFormValues['recipeIngredients'][number] {
  const emptyNote = { preparationNote: '', amountNote: '' };
  return {
    ingredientId: '',
    unitId: '',
    quantity: '',
    isOptional: false,
    notes: { MY: { ...emptyNote }, EN: { ...emptyNote } },
  };
}

export function emptyStep(): RecipeFormValues['steps'][number] {
  const emptyStepTranslation = {
    instruction: '',
    timerLabel: '',
    completionCue: '',
    tip: '',
    warning: '',
  };
  return {
    durationMinutes: '',
    translations: { MY: { ...emptyStepTranslation }, EN: { ...emptyStepTranslation } },
  };
}

const linesToArray = (text: string): string[] =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const arrayToLines = (values: string[]): string => values.join('\n');

const emptyToNull = (value: string): string | null => (value.trim() ? value : null);

function toFormValues(recipe: Recipe): RecipeFormValues {
  const translationFor = (code: LanguageCode) => {
    const t = recipe.translations.find((item) => item.languageCode === code);
    return {
      title: t?.title ?? '',
      summary: t?.summary ?? '',
      overview: t?.overview ?? '',
      goodToKnow: arrayToLines(t?.goodToKnow ?? []),
      servingSuggestions: arrayToLines(t?.servingSuggestions ?? []),
      searchKeywords: arrayToLines(t?.searchKeywords ?? []),
    };
  };

  const stepTranslationFor = (
    step: Recipe['steps'][number],
    code: LanguageCode,
  ) => {
    const t = step.translations.find((item) => item.languageCode === code);
    return {
      instruction: t?.instruction ?? '',
      timerLabel: t?.timerLabel ?? '',
      completionCue: t?.completionCue ?? '',
      tip: t?.tip ?? '',
      warning: t?.warning ?? '',
    };
  };

  return {
    slug: recipe.slug,
    status: recipe.status,
    cuisineCode: recipe.cuisineCode,
    servings: recipe.servings,
    prepMinutes: recipe.prepMinutes,
    cookMinutes: recipe.cookMinutes,
    difficulty: recipe.difficulty,
    spiceLevel: recipe.spiceLevel,
    isFeatured: recipe.isFeatured,
    categoryIds: recipe.categoryIds,
    translations: { MY: translationFor('MY'), EN: translationFor('EN') },
    steps: [...recipe.steps]
      .sort((a, b) => a.position - b.position)
      .map((step) => ({
        durationMinutes:
          step.durationSeconds != null ? String(Math.round(step.durationSeconds / 60)) : '',
        translations: {
          MY: stepTranslationFor(step, 'MY'),
          EN: stepTranslationFor(step, 'EN'),
        },
      })),
    recipeIngredients: [...recipe.recipeIngredients]
      .sort((a, b) => a.position - b.position)
      .map((ingredient) => ({
        ingredientId: ingredient.ingredientId,
        unitId: ingredient.unitId ?? '',
        quantity: ingredient.quantity != null ? String(ingredient.quantity) : '',
        isOptional: ingredient.isOptional,
        notes: {
          MY: ingredientNoteFor(ingredient, 'MY'),
          EN: ingredientNoteFor(ingredient, 'EN'),
        },
      })),
  };
}

function ingredientNoteFor(ingredient: Recipe['recipeIngredients'][number], code: LanguageCode) {
  const t = ingredient.translations.find((item) => item.languageCode === code);
  return {
    preparationNote: t?.preparationNote ?? '',
    amountNote: t?.amountNote ?? '',
  };
}

function toPayload(values: RecipeFormValues, coverImagePath: string | null): CreateRecipeInput {
  return {
    slug: values.slug,
    status: values.status,
    cuisineCode: values.cuisineCode,
    coverImagePath,
    servings: values.servings,
    prepMinutes: values.prepMinutes,
    cookMinutes: values.cookMinutes,
    difficulty: values.difficulty,
    spiceLevel: values.spiceLevel,
    isFeatured: values.isFeatured,
    categoryIds: values.categoryIds,
    translations: LANGUAGES.map(({ code }) => {
      const t = values.translations[code];
      return {
        languageCode: code,
        title: t.title,
        summary: emptyToNull(t.summary),
        overview: emptyToNull(t.overview),
        goodToKnow: linesToArray(t.goodToKnow),
        servingSuggestions: linesToArray(t.servingSuggestions),
        searchKeywords: linesToArray(t.searchKeywords),
        status: 'DRAFT',
      };
    }),
    steps: values.steps.map((step, index) => ({
      position: index,
      durationSeconds: step.durationMinutes.trim()
        ? Number(step.durationMinutes) * 60
        : null,
      // Only send a language's step text when it has an instruction.
      translations: LANGUAGES.filter(
        ({ code }) => step.translations[code].instruction.trim(),
      ).map(({ code }) => {
        const t = step.translations[code];
        return {
          languageCode: code,
          instruction: t.instruction,
          timerLabel: emptyToNull(t.timerLabel),
          completionCue: emptyToNull(t.completionCue),
          tip: emptyToNull(t.tip),
          warning: emptyToNull(t.warning),
        };
      }),
    })),
    recipeIngredients: values.recipeIngredients.map((ingredient) => ({
      ingredientId: ingredient.ingredientId,
      unitId: ingredient.unitId ? ingredient.unitId : null,
      quantity: ingredient.quantity.trim() ? Number(ingredient.quantity) : null,
      isOptional: ingredient.isOptional,
      // Only send a language's notes when at least one field is filled.
      translations: LANGUAGES.filter(
        ({ code }) =>
          ingredient.notes[code].preparationNote.trim() ||
          ingredient.notes[code].amountNote.trim(),
      ).map(({ code }) => ({
        languageCode: code,
        preparationNote: emptyToNull(ingredient.notes[code].preparationNote),
        amountNote: emptyToNull(ingredient.notes[code].amountNote),
      })),
    })),
  };
}

/**
 * Owns the create/edit recipe flow: form state/validation, the cover-image file +
 * its upload, and the create-or-update mutation. Provide `recipe` to edit; the form
 * seeds from it and submits an update. On success it returns to the recipe list.
 */
export function useRecipeForm(recipe?: Recipe) {
  const navigate = useNavigate();
  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();
  const isEdit = Boolean(recipe);
  const mutation = recipe ? updateRecipe : createRecipe;

  const [cover, setCover] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: recipe ? toFormValues(recipe) : EMPTY_VALUES,
  });

  const { reset } = form;
  useEffect(() => {
    if (recipe) reset(toFormValues(recipe));
  }, [recipe, reset]);

  const submit = form.handleSubmit(async (values) => {
    setUploadError(null);

    let coverImagePath: string | null = recipe?.coverImagePath ?? null;
    if (cover) {
      try {
        setIsUploading(true);
        coverImagePath = await uploadFile(cover, 'recipes');
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : 'Failed to upload cover image.');
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const payload = toPayload(values, coverImagePath);
    const onSuccess = () => navigate('/recipes');

    if (recipe) {
      updateRecipe.mutate({ id: recipe.id, input: payload }, { onSuccess });
    } else {
      createRecipe.mutate(payload, { onSuccess });
    }
  });

  const errorMessage =
    uploadError ??
    (mutation.isError
      ? mutation.error instanceof Error
        ? mutation.error.message
        : `Failed to ${isEdit ? 'update' : 'create'} recipe.`
      : null);

  return {
    form,
    submit,
    cover,
    setCover,
    currentCoverUrl: recipe?.coverImagePath ?? null,
    isEdit,
    isUploading,
    isBusy: isUploading || mutation.isPending,
    isSaving: mutation.isPending,
    errorMessage,
  };
}
