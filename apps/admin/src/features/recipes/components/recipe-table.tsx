import { ImageOff, Pencil, Search, Star, Trash2 } from 'lucide-react';

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
import { recipeStatusSchema, type RecipeStatus } from '@repo/contracts';

import type { RecipeRow } from '@/features/recipes/types';
import { RECIPE_DIFFICULTY_LABELS, RECIPE_STATUS_LABELS } from '@/features/recipes/labels';
import { cn } from '@/shared/lib/utils';

export type RecipeStatusFilter = 'all' | RecipeStatus;

type RecipeTableProps = {
  recipes: RecipeRow[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  status: RecipeStatusFilter;
  onStatusChange: (value: RecipeStatusFilter) => void;
  isLoading?: boolean;
  onEdit?: (recipe: RecipeRow) => void;
  onDelete?: (recipe: RecipeRow) => void;
};

const STATUS_FILTERS: RecipeStatusFilter[] = ['all', ...recipeStatusSchema.options];

function formatDuration(totalMinutes: number): string {
  if (totalMinutes <= 0) return '—';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  return `${minutes}m`;
}

export function RecipeTable({
  recipes,
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
}: RecipeTableProps) {
  const columns: DataTableColumn<RecipeRow>[] = [
    {
      id: 'image',
      header: 'Cover',
      cell: (recipe) =>
        recipe.image ? (
          <img className="size-10 rounded-md object-cover" src={recipe.image} alt="" />
        ) : (
          <span className="grid size-10 place-items-center rounded-md bg-muted text-muted-foreground">
            <ImageOff className="size-4" />
          </span>
        ),
    },
    {
      id: 'title',
      header: 'Title',
      cell: (recipe) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{recipe.title}</span>
          {recipe.isFeatured && (
            <Star className="size-3.5 fill-primary text-primary" aria-label="Featured" />
          )}
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (recipe) => (
        <Badge variant={recipe.status === 'PUBLISHED' ? 'success' : 'muted'}>
          <span
            className={cn(
              'size-1.5 rounded-full',
              recipe.status === 'PUBLISHED' ? 'bg-success' : 'bg-muted-foreground',
            )}
          />
          {RECIPE_STATUS_LABELS[recipe.status]}
        </Badge>
      ),
    },
    {
      id: 'difficulty',
      header: 'Difficulty',
      cell: (recipe) => (
        <span className="text-muted-foreground">{RECIPE_DIFFICULTY_LABELS[recipe.difficulty]}</span>
      ),
    },
    {
      id: 'servings',
      header: 'Servings',
      cell: (recipe) => <span className="tabular-nums">{recipe.servings}</span>,
    },
    {
      id: 'time',
      header: 'Total time',
      cell: (recipe) => (
        <span className="tabular-nums text-muted-foreground">
          {formatDuration(recipe.totalMinutes)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (recipe) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="size-8 text-muted-foreground"
            aria-label={`Edit ${recipe.title}`}
            onClick={() => onEdit?.(recipe)}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8 text-muted-foreground"
            aria-label={`Delete ${recipe.title}`}
            onClick={() => onDelete?.(recipe)}
          >
            <Trash2 className="size-4" />
          </Button>
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
            aria-label="Search recipes"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search recipes..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <Select value={status} onValueChange={(value) => onStatusChange(value as RecipeStatusFilter)}>
          <SelectTrigger aria-label="Filter by status" className="sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((value) => (
              <SelectItem key={value} value={value}>
                {value === 'all' ? 'All status' : RECIPE_STATUS_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        rows={recipes}
        getRowId={(recipe) => recipe.id}
        emptyMessage={isLoading ? 'Loading…' : 'No recipes found.'}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalCount={total}
        onPageChange={onPageChange}
        itemLabel="recipes"
      />
    </Card>
  );
}
