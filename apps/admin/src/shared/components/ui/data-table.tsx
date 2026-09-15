import { type ReactNode } from 'react';

import { Checkbox } from '@/shared/components/ui/checkbox';
import { cn } from '@/shared/lib/utils';

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
  headerClassName?: string;
  cellClassName?: string;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  /** Enable the leading checkbox column. Selection state is owned by the caller. */
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleRow?: (id: string) => void;
  onToggleAll?: () => void;
  /** aria-label for a row's checkbox (falls back to the row id). */
  rowLabel?: (row: T) => string;
  emptyMessage?: ReactNode;
  /** Tailwind min-width for the table (keeps columns readable on small screens). */
  minWidthClassName?: string;
};

const ALIGN_CLASS = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

/**
 * Generic, presentational table. It owns layout, the optional selection column
 * and the empty state; the caller supplies columns, rows and selection handlers.
 * Toolbars (search/filters) and pagination are composed around it, not inside.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  selectable = false,
  selectedIds,
  onToggleRow,
  onToggleAll,
  rowLabel,
  emptyMessage = 'No results found.',
  minWidthClassName = 'min-w-[46rem]',
}: DataTableProps<T>) {
  const columnCount = columns.length + (selectable ? 1 : 0);

  const selectedCount = selectable
    ? rows.filter((row) => selectedIds?.has(getRowId(row))).length
    : 0;
  const allSelected = rows.length > 0 && selectedCount === rows.length;
  const someSelected = selectedCount > 0 && !allSelected;

  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full border-collapse text-sm', minWidthClassName)}>
        <thead>
          <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {selectable && (
              <th className="w-10 px-4 py-3">
                <Checkbox
                  aria-label="Select all"
                  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                  onCheckedChange={() => onToggleAll?.()}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.id}
                className={cn(
                  'px-2 py-3 font-medium',
                  ALIGN_CLASS[column.align ?? 'left'],
                  column.headerClassName,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const id = getRowId(row);
            return (
              <tr className="border-b border-border/70 last:border-0 hover:bg-muted/40" key={id}>
                {selectable && (
                  <td className="px-4 py-3">
                    <Checkbox
                      aria-label={rowLabel ? `Select ${rowLabel(row)}` : `Select ${id}`}
                      checked={selectedIds?.has(id) ?? false}
                      onCheckedChange={() => onToggleRow?.(id)}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn('px-2 py-3', ALIGN_CLASS[column.align ?? 'left'], column.cellClassName)}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td className="px-4 py-10 text-center text-muted-foreground" colSpan={columnCount}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
