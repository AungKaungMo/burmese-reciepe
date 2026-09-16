import { ImageOff, Pencil, Search, Trash2 } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { DataTable, type DataTableColumn } from '@/shared/components/ui/data-table';
import { Pagination } from '@/shared/components/ui/pagination';
import type { NutrientRow } from '@/features/nutrients/types';

type NutrientTableProps = {
  nutrients: NutrientRow[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
  onEdit?: (nutrient: NutrientRow) => void;
  onDelete?: (nutrient: NutrientRow) => void;
};

export function NutrientTable({
  nutrients,
  total,
  page,
  pageSize,
  onPageChange,
  search,
  onSearchChange,
  isLoading = false,
  onEdit,
  onDelete,
}: NutrientTableProps) {
  const columns: DataTableColumn<NutrientRow>[] = [
    {
      id: 'icon',
      header: 'Icon',
      cell: (nutrient) =>
        nutrient.icon ? (
          <img className="size-10 rounded-md object-cover" src={nutrient.icon} alt="" />
        ) : (
          <span className="grid size-10 place-items-center rounded-md bg-muted text-muted-foreground">
            <ImageOff className="size-4" />
          </span>
        ),
    },
    {
      id: 'name',
      header: 'Name',
      cell: (nutrient) => <span className="font-medium">{nutrient.name}</span>,
    },
    {
      id: 'unit',
      header: 'Unit',
      cell: (nutrient) => <span className="tabular-nums text-muted-foreground">{nutrient.unit}</span>,
    },
    {
      id: 'description',
      header: 'Description',
      cell: (nutrient) => (
        <span
          className="block max-w-[16rem] truncate text-muted-foreground"
          title={nutrient.description}
        >
          {nutrient.description || '—'}
        </span>
      ),
    },
    {
      id: 'code',
      header: 'Code',
      cell: (nutrient) => (
        <span className="font-mono text-xs text-muted-foreground">{nutrient.code}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (nutrient) => (
        <div className="flex items-center justify-end gap-1">
          {onEdit && (
            <Button
              size="icon"
              variant="ghost"
              className="size-8 text-muted-foreground"
              aria-label={`Edit ${nutrient.name}`}
              onClick={() => onEdit(nutrient)}
            >
              <Pencil className="size-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="icon"
              variant="ghost"
              className="size-8 text-muted-foreground"
              aria-label={`Delete ${nutrient.name}`}
              onClick={() => onDelete(nutrient)}
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
            aria-label="Search nutrients"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search nutrients..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={nutrients}
        getRowId={(nutrient) => nutrient.id}
        emptyMessage={isLoading ? 'Loading…' : 'No nutrients found.'}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalCount={total}
        onPageChange={onPageChange}
        itemLabel="nutrients"
      />
    </Card>
  );
}
