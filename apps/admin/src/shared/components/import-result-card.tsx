import { X } from 'lucide-react';

import type { ImportResult } from '@repo/contracts';

import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

type ImportResultCardProps = {
  result: ImportResult;
  onDismiss: () => void;
};

/** Dismissible summary of an xlsx import: created/failed counts + per-row errors. */
export function ImportResultCard({ result, onDismiss }: ImportResultCardProps) {
  return (
    <Card className="mt-4 flex flex-col gap-3 p-4 text-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium">
          Import finished — {result.created} created, {result.failed} failed of {result.total}{' '}
          row{result.total === 1 ? '' : 's'}.
        </p>
        <Button
          size="icon"
          variant="ghost"
          className="size-7 shrink-0 text-muted-foreground"
          aria-label="Dismiss import summary"
          onClick={onDismiss}
        >
          <X className="size-4" />
        </Button>
      </div>
      {result.errors.length > 0 && (
        <ul className="flex max-h-48 flex-col gap-1 overflow-auto text-xs text-destructive">
          {result.errors.map((rowError) => (
            <li key={rowError.row}>
              Row {rowError.row}
              {rowError.code ? ` (${rowError.code})` : ''}: {rowError.message}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
