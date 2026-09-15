import { ImageOff, Pencil, Search, Star, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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
import type { RecipeRow } from '@/features/recipes/types';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { cn } from '@/shared/lib/utils';

type RecipeTableProps = {
  recipes: RecipeRow[];
  onEdit?: (recipe: RecipeRow) => void;
  onDelete?: (recipe: RecipeRow) => void;
};

const STATUS_FILTERS = ['all', 'DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
const PAGE_SIZE = 8;

const STATUS_LABELS: Record<RecipeRow['status'], string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
};

const DIFFICULTY_LABELS: Record<RecipeRow['difficulty'], string> = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
};

function formatDuration(totalMinutes: number): string {
  if (totalMinutes <= 0) return '—';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  return `${minutes}m`;
}

export function RecipeTable({ recipes, onEdit, onDelete }: RecipeTableProps) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  // Filter on the debounced term so typing doesn't refilter on every keystroke.
  const debouncedQuery = useDebouncedValue(query.trim(), 600);

  const filtered = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesQuery = recipe.title.toLowerCase().includes(debouncedQuery.toLowerCase());
      const matchesStatus = status === 'all' || recipe.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [recipes, debouncedQuery, status]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, status]);

  const pageRows = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  function toggleAll() {
    setSelected((current) => {
      if (pageRows.every((row) => current.has(row.id))) {
        const next = new Set(current);
        pageRows.forEach((row) => next.delete(row.id));
        return next;
      }
      return new Set([...current, ...pageRows.map((row) => row.id)]);
    });
  }

  function toggleOne(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

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
          {STATUS_LABELS[recipe.status]}
        </Badge>
      ),
    },
    {
      id: 'difficulty',
      header: 'Difficulty',
      cell: (recipe) => (
        <span className="text-muted-foreground">{DIFFICULTY_LABELS[recipe.difficulty]}</span>
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
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as (typeof STATUS_FILTERS)[number])}
        >
          <SelectTrigger aria-label="Filter by status" className="sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        rows={pageRows}
        getRowId={(recipe) => recipe.id}
        selectable
        selectedIds={selected}
        onToggleRow={toggleOne}
        onToggleAll={toggleAll}
        rowLabel={(recipe) => recipe.title}
        emptyMessage="No recipes found."
      />

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        totalCount={filtered.length}
        onPageChange={setPage}
        itemLabel="recipes"
      />
    </Card>
  );
}
