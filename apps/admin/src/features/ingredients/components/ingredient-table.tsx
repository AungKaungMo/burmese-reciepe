import { ImageOff, Pencil, Search, Trash2 } from 'lucide-react';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { DataTable, type DataTableColumn } from '@/shared/components/ui/data-table';
import { Pagination } from '@/shared/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { IngredientRow } from '@/features/ingredients/types';
import { cn } from '@/shared/lib/utils';

export type IngredientStatusFilter = 'all' | 'active' | 'inactive';

type IngredientTableProps = {
  ingredients: IngredientRow[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  status: IngredientStatusFilter;
  onStatusChange: (value: IngredientStatusFilter) => void;
  isLoading?: boolean;
  onEdit?: (ingredient: IngredientRow) => void;
  onDelete?: (ingredient: IngredientRow) => void;
};

export function IngredientTable({
  ingredients,
  total,
  page,
  pageSize,
  onPageChange,
  search,
  onSearchChange,
  status,
  onStatusChange,
  isLoading = false,
  onEdit,
  onDelete,
}: IngredientTableProps) {
  const columns: DataTableColumn<IngredientRow>[] = [
    {
      id: 'icon',
      header: 'Icon',
      cell: (ingredient) =>
        ingredient.emoji ? (
          <span className="grid size-10 place-items-center rounded-md bg-muted text-xl">
            {ingredient.emoji}
          </span>
        ) : ingredient.icon ? (
          <img className="size-10 rounded-md object-cover" src={ingredient.icon} alt="" />
        ) : (
          <span className="grid size-10 place-items-center rounded-md bg-muted text-muted-foreground">
            <ImageOff className="size-4" />
          </span>
        ),
    },
    {
      id: 'name',
      header: 'Name',
      cell: (ingredient) => <span className="font-medium">{ingredient.name}</span>,
    },
    {
      id: 'aliases',
      header: 'Aliases',
      cell: (ingredient) => (
        <span className="text-muted-foreground">{ingredient.aliases || '—'}</span>
      ),
    },
    {
      id: 'code',
      header: 'Code',
      cell: (ingredient) => (
        <span className="font-mono text-xs text-muted-foreground">{ingredient.code}</span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (ingredient) => (
        <Badge variant={ingredient.status === 'active' ? 'success' : 'muted'}>
          <span
            className={cn(
              'size-1.5 rounded-full',
              ingredient.status === 'active' ? 'bg-success' : 'bg-muted-foreground',
            )}
          />
          {ingredient.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (ingredient) => (
        <div className="flex items-center justify-end gap-1">
          {onEdit && (
            <Button
              size="icon"
              variant="ghost"
              className="size-8 text-muted-foreground"
              aria-label={`Edit ${ingredient.name}`}
              onClick={() => onEdit(ingredient)}
            >
              <Pencil className="size-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="icon"
              variant="ghost"
              className="size-8 text-muted-foreground"
              aria-label={`Delete ${ingredient.name}`}
              onClick={() => onDelete(ingredient)}
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
            aria-label="Search ingredients"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search ingredients..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <Select value={status} onValueChange={(value) => onStatusChange(value as IngredientStatusFilter)}>
          <SelectTrigger aria-label="Filter by status" className="sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        rows={ingredients}
        getRowId={(ingredient) => ingredient.id}
        emptyMessage={isLoading ? 'Loading…' : 'No ingredients found.'}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalCount={total}
        onPageChange={onPageChange}
        itemLabel="ingredients"
      />
    </Card>
  );
}
