import { useMemo, useState } from 'react';

import type { Ingredient, IngredientSubstitution } from '@repo/contracts';

import { useIngredients } from '@/features/ingredients/api/queries';
import {
  useSubstitutions,
  useDeleteSubstitution,
} from '@/features/ingredients/api/substitution-queries';
import { toSubstituteOptions } from '@/features/ingredients/components/substitution-form-card';
import { useConfirm } from '@/shared/components/confirm-dialog';

function ingredientName(ingredient: Ingredient): string {
  const translation =
    ingredient.translations.find((t) => t.languageCode === 'EN') ?? ingredient.translations[0];
  return translation?.name ?? ingredient.code;
}

type EditorState = null | 'new' | string;

export function useSubstitutionsPanel(ingredient: Ingredient) {
  const [editor, setEditor] = useState<EditorState>(null);

  const { data: substitutionsPage, isPending } = useSubstitutions({
    originalIngredientId: ingredient.id,
    page: 1,
    pageSize: 100,
  });
  const { data: ingredientsPage } = useIngredients({ page: 1, pageSize: 100 });

  const substitutions = substitutionsPage?.items ?? [];
  const allIngredients = useMemo(() => ingredientsPage?.items ?? [], [ingredientsPage]);

  const nameById = useMemo(() => {
    const map = new Map<string, string>();
    allIngredients.forEach((i) => map.set(i.id, ingredientName(i)));
    return map;
  }, [allIngredients]);

  const options = useMemo(
    () => toSubstituteOptions(allIngredients, ingredient.id),
    [allIngredients, ingredient.id],
  );

  const deleteSubstitution = useDeleteSubstitution();
  const confirm = useConfirm();

  async function handleDelete(substitution: IngredientSubstitution) {
    const name = nameById.get(substitution.substituteIngredientId) ?? 'this substitution';
    const confirmed = await confirm({
      title: `Remove “${name}” as a substitute?`,
      description: 'This cannot be undone.',
      confirmLabel: 'Remove',
    });
    if (confirmed) deleteSubstitution.mutate(substitution.id);
  }

  const editing =
    typeof editor === 'string' && editor !== 'new'
      ? substitutions.find((s) => s.id === editor)
      : undefined;

  return {
    originalIngredientId: ingredient.id,
    title: ingredientName(ingredient),
    substitutions,
    isPending,
    options,
    nameById,
    editor,
    editing,
    isAdding: editor === 'new',
    startAdd: () => setEditor('new'),
    startEdit: (id: string) => setEditor(id),
    closeEditor: () => setEditor(null),
    onDelete: handleDelete,
  };
}
