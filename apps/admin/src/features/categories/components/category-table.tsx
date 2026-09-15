import { ImageOff, Pencil, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

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
import type { CategoryRow } from '@/features/categories/types';
import { cn } from '@/shared/lib/utils';

export type CategoryStatusFilter = 'all' | 'active' | 'inactive';

type CategoryTableProps = {
  categories: CategoryRow[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  status: CategoryStatusFilter;
  onStatusChange: (value: CategoryStatusFilter) => void;
  isLoading?: boolean;
  onEdit?: (category: CategoryRow) => void;
  onDelete?: (category: CategoryRow) => void;
};

export function CategoryTable({
  categories,
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
}: CategoryTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggleAll() {
    setSelected((current) => {
      if (categories.every((row) => current.has(row.id))) {
        const next = new Set(current);
        categories.forEach((row) => next.delete(row.id));
        return next;
      }
      return new Set([...current, ...categories.map((row) => row.id)]);
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

  const columns: DataTableColumn<CategoryRow>[] = [
    {
      id: 'image',
      header: 'Image',
      cell: (category) =>
        category.image ? (
          <img className="size-10 rounded-md object-cover" src={category.image} alt="" />
        ) : (
          <span className="grid size-10 place-items-center rounded-md bg-muted text-muted-foreground">
            <ImageOff className="size-4" />
          </span>
        ),
    },
    {
      id: 'name',
      header: 'Name',
      cell: (category) => <span className="font-medium">{category.name}</span>,
    },
    {
      id: 'description',
      header: 'Description',
      cell: (category) => <span className="text-muted-foreground">{category.description}</span>,
    },
    {
      id: 'code',
      header: 'Code',
      cell: (category) => (
        <span className="font-mono text-xs text-muted-foreground">{category.code}</span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (category) => (
        <Badge variant={category.status === 'active' ? 'success' : 'muted'}>
          <span
            className={cn(
              'size-1.5 rounded-full',
              category.status === 'active' ? 'bg-success' : 'bg-muted-foreground',
            )}
          />
          {category.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (category) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="size-8 text-muted-foreground"
            aria-label={`Edit ${category.name}`}
            onClick={() => onEdit?.(category)}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8 text-muted-foreground"
            aria-label={`Delete ${category.name}`}
            onClick={() => onDelete?.(category)}
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
            aria-label="Search categories"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search categories..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <Select value={status} onValueChange={(value) => onStatusChange(value as CategoryStatusFilter)}>
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
        rows={categories}
        getRowId={(category) => category.id}
        selectable
        selectedIds={selected}
        onToggleRow={toggleOne}
        onToggleAll={toggleAll}
        rowLabel={(category) => category.name}
        emptyMessage={isLoading ? 'Loading…' : 'No categories found.'}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalCount={total}
        onPageChange={onPageChange}
        itemLabel="categories"
      />
    </Card>
  );
}
