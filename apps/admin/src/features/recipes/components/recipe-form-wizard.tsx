import { useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { FieldPath } from 'react-hook-form';

import {
  CategoriesCard,
  DetailsCard,
  IngredientsCard,
  StepsCard,
  TranslationsCard,
} from '@/features/recipes/components/recipe-form-fields';
import type { RecipeFormValues } from '@/features/recipes/hooks/use-recipe-form';
import type { useRecipeForm } from '@/features/recipes/hooks/use-recipe-form';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

type RecipeFormApi = ReturnType<typeof useRecipeForm>;

type StepDef = {
  title: string;
  /** Fields validated before advancing past this step. */
  fields: FieldPath<RecipeFormValues>[];
};

const STEPS: StepDef[] = [
  { title: 'Details', fields: ['slug', 'cuisineCode', 'servings', 'prepMinutes', 'cookMinutes'] },
  { title: 'Translations', fields: ['translations'] },
  { title: 'Ingredients', fields: ['recipeIngredients'] },
  { title: 'Steps', fields: ['steps'] },
];

/**
 * Multi-step recipe form. Splits the long form into Details → Translations →
 * Ingredients → Steps, validating the current step's fields before advancing and
 * only submitting on the final step.
 */
export function RecipeFormWizard({
  api,
  submitLabel,
}: {
  api: RecipeFormApi;
  submitLabel: string;
}) {
  const { form, submit, cover, setCover, currentCoverUrl, isBusy, isUploading, isSaving, errorMessage } =
    api;
  const [step, setStep] = useState(0);
  // The furthest step visited, so the stepper can jump to any already-reached step
  // (even after navigating back to an earlier one). When editing, every step is
  // already populated, so they're all reachable from the start.
  const [maxReached, setMaxReached] = useState(() => (api.isEdit ? STEPS.length - 1 : 0));
  // A real submit is "armed" only by a pointer/key press that lands on the Submit
  // button itself. When Next advances to the last step, React swaps Next → Submit
  // mid-click and the browser dispatches a phantom click on the new Submit button —
  // but that click was never armed (its press started on Next), so we ignore it.
  const submitArmed = useRef(false);

  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  async function goNext() {
    // Validate just this step's fields before moving on.
    const valid = await form.trigger(STEPS[step].fields);
    if (!valid) return;
    const next = Math.min(step + 1, STEPS.length - 1);
    setStep(next);
    setMaxReached((current) => Math.max(current, next));
  }

  function handleSubmitClick() {
    if (!submitArmed.current) return;
    submitArmed.current = false;
    void submit();
  }

  // The form never auto-submits; submission goes through the armed Submit button.
  function preventImplicitSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form onSubmit={preventImplicitSubmit} noValidate className="flex flex-col gap-6">
      <Stepper current={step} maxReached={maxReached} onSelect={setStep} />

      <div className={cn(step !== 0 && 'hidden')}>
        <div className="flex flex-col gap-6">
          <DetailsCard
            form={form}
            cover={cover}
            onCoverChange={setCover}
            currentCoverUrl={currentCoverUrl}
          />
        </div>
      </div>
      <div className={cn(step !== 1 && 'hidden')}>
        <div className="flex flex-col gap-6">
          <TranslationsCard form={form} />
          <CategoriesCard form={form} />
        </div>
      </div>
      <div className={cn(step !== 2 && 'hidden')}>
        <IngredientsCard form={form} />
      </div>
      <div className={cn(step !== 3 && 'hidden')}>
        <StepsCard form={form} />
      </div>

      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="outline" disabled={isBusy} asChild>
          <Link to="/recipes">Cancel</Link>
        </Button>

        <div className="flex items-center gap-3">
          {!isFirst && (
            <Button type="button" variant="outline" disabled={isBusy} onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft className="size-4" /> Back
            </Button>
          )}
          {!isLast ? (
            <Button type="button" onClick={goNext}>
              Next <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              type="button"
              disabled={isBusy}
              onPointerDown={() => {
                submitArmed.current = true;
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') submitArmed.current = true;
              }}
              onClick={handleSubmitClick}
            >
              <Check className="size-4" />
              {isUploading ? 'Uploading…' : isSaving ? 'Saving…' : submitLabel}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

/** The step indicator; any already-reached step is clickable (jump forward or back). */
function Stepper({
  current,
  maxReached,
  onSelect,
}: {
  current: number;
  maxReached: number;
  onSelect: (index: number) => void;
}) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {STEPS.map((stepDef, index) => {
        const isActive = index === current;
        const isReached = index <= maxReached;
        const isDone = isReached && !isActive;
        return (
          <li key={stepDef.title} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => isReached && onSelect(index)}
              disabled={!isReached}
              className={cn(
                'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors',
                isActive
                  ? 'border-primary bg-primary/10 text-primary'
                  : isDone
                    ? 'border-border text-foreground hover:bg-muted/50'
                    : 'border-border text-muted-foreground',
                !isReached && 'cursor-not-allowed',
              )}
            >
              <span
                className={cn(
                  'grid size-5 place-items-center rounded-full text-xs font-semibold',
                  isActive || isDone ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                )}
              >
                {isDone ? <Check className="size-3" /> : index + 1}
              </span>
              {stepDef.title}
            </button>
            {index < STEPS.length - 1 && <span className="h-px w-6 bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}
