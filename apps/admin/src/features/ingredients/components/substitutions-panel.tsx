import { Plus, Pencil, Trash2 } from 'lucide-react';

import type { Ingredient, IngredientSubstitution } from '@repo/contracts';

import { SubstitutionFormCard } from '@/features/ingredients/components/substitution-form-card';
import { useSubstitutionsPanel } from '@/features/ingredients/hooks/use-substitutions-panel';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

/** "100g → 80g" style conversion summary, or `null` when no amounts are set. */
function amountSummary(substitution: IngredientSubstitution): string | null {
  const left =
    substitution.originalAmount != null
      ? `${substitution.originalAmount}${substitution.originalUnitCode ?? ''}`
      : null;
  const right =
    substitution.substituteAmount != null
      ? `${substitution.substituteAmount}${substitution.substituteUnitCode ?? ''}`
      : null;
  if (left && right) return `${left} → ${right}`;
  return left ?? right;
}

export function SubstitutionsPanel({ ingredient }: { ingredient: Ingredient }) {
  const {
    originalIngredientId,
    title,
    substitutions,
    isPending,
    options,
    nameById,
    editor,
    editing,
    isAdding,
    startAdd,
    startEdit,
    closeEditor,
    onDelete,
  } = useSubstitutionsPanel(ingredient);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Ingredients that can stand in for{' '}
          <span className="font-medium text-foreground">{title}</span>.
        </p>
        {editor === null && (
          <Button size="sm" onClick={startAdd}>
            <Plus className="size-4" /> Add Substitution
          </Button>
        )}
      </div>

      {isAdding && (
        <SubstitutionFormCard
          originalIngredientId={originalIngredientId}
          options={options}
          onDone={closeEditor}
          onCancel={closeEditor}
        />
      )}

      {isPending ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">Loading substitutions…</Card>
      ) : substitutions.length === 0 && editor === null ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          No substitutions yet. Add one to get started.
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {substitutions.map((substitution) =>
            editor === substitution.id && editing ? (
              <SubstitutionFormCard
                key={substitution.id}
                originalIngredientId={originalIngredientId}
                options={options}
                substitution={editing}
                onDone={closeEditor}
                onCancel={closeEditor}
              />
            ) : (
              <Card key={substitution.id} className="flex items-center justify-between gap-4 p-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {nameById.get(substitution.substituteIngredientId) ?? 'Unknown ingredient'}
                    </span>
                    <Badge variant={substitution.isActive ? 'success' : 'muted'}>
                      {substitution.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Priority {substitution.priority}</span>
                  </div>
                  {amountSummary(substitution) && (
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {amountSummary(substitution)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-muted-foreground"
                    aria-label="Edit substitution"
                    onClick={() => startEdit(substitution.id)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-muted-foreground"
                    aria-label="Delete substitution"
                    onClick={() => onDelete(substitution)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </Card>
            ),
          )}
        </div>
      )}
    </div>
  );
}
