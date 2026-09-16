import { Pencil, Search, Trash2 } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { DataTable, type DataTableColumn } from '@/shared/components/ui/data-table';
import { Pagination } from '@/shared/components/ui/pagination';
import type { MeasurementUnitRow } from '@/features/measurement-units/types';

type MeasurementUnitTableProps = {
  units: MeasurementUnitRow[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
  onEdit?: (unit: MeasurementUnitRow) => void;
  onDelete?: (unit: MeasurementUnitRow) => void;
};

export function MeasurementUnitTable({
  units,
  total,
  page,
  pageSize,
  onPageChange,
  search,
  onSearchChange,
  isLoading = false,
  onEdit,
  onDelete,
}: MeasurementUnitTableProps) {
  const columns: DataTableColumn<MeasurementUnitRow>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (unit) => <span className="font-medium">{unit.name}</span>,
    },
    {
      id: 'symbol',
      header: 'Symbol',
      cell: (unit) => <span className="tabular-nums">{unit.symbol}</span>,
    },
    {
      id: 'shortLabel',
      header: 'Short label',
      cell: (unit) => <span className="text-muted-foreground">{unit.shortLabel}</span>,
    },
    {
      id: 'code',
      header: 'Code',
      cell: (unit) => <span className="font-mono text-xs text-muted-foreground">{unit.code}</span>,
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (unit) => (
        <div className="flex items-center justify-end gap-1">
          {onEdit && (
            <Button
              size="icon"
              variant="ghost"
              className="size-8 text-muted-foreground"
              aria-label={`Edit ${unit.name}`}
              onClick={() => onEdit(unit)}
            >
              <Pencil className="size-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="icon"
              variant="ghost"
              className="size-8 text-muted-foreground"
              aria-label={`Delete ${unit.name}`}
              onClick={() => onDelete(unit)}
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex h-10 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 shadow-xs sm:max-w-sm">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            aria-label="Search measurement units"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search units..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={units}
        getRowId={(unit) => unit.id}
        emptyMessage={isLoading ? 'Loading…' : 'No measurement units found.'}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalCount={total}
        onPageChange={onPageChange}
        itemLabel="units"
      />
    </Card>
  );
}
