import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

type PaginationProps = {
  /** 1-based current page. */
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  /** Noun used in the summary line, e.g. "categories". */
  itemLabel?: string;
};

const ELLIPSIS = 'ellipsis';

/** Builds a compact page list with ellipses, e.g. [1, 'ellipsis', 4, 5, 6, 'ellipsis', 20]. */
function getPageItems(page: number, totalPages: number): (number | typeof ELLIPSIS)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: (number | typeof ELLIPSIS)[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) items.push(ELLIPSIS);
  for (let current = start; current <= end; current += 1) items.push(current);
  if (end < totalPages - 1) items.push(ELLIPSIS);

  items.push(totalPages);
  return items;
}

/**
 * Reusable pager: a "Showing a–b of n" summary plus prev / numbered / next
 * controls. Page state is owned by the caller via `onPageChange`.
 */
export function Pagination({ page, pageSize, totalCount, onPageChange, itemLabel }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const current = Math.min(Math.max(page, 1), totalPages);
  const start = totalCount === 0 ? 0 : (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, totalCount);
  const suffix = itemLabel ? ` ${itemLabel}` : '';

  return (
    <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {start}–{end} of {totalCount}
        {suffix}
      </p>
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="outline"
          className="size-8"
          aria-label="Previous page"
          disabled={current <= 1}
          onClick={() => onPageChange(current - 1)}
        >
          <ChevronLeft className="size-4" />
        </Button>
        {getPageItems(current, totalPages).map((item, index) =>
          item === ELLIPSIS ? (
            <span key={`ellipsis-${index}`} className="px-1 text-sm text-muted-foreground">
              …
            </span>
          ) : (
            <Button
              key={item}
              size="icon"
              variant={item === current ? 'default' : 'outline'}
              className="size-8"
              aria-label={`Page ${item}`}
              aria-current={item === current ? 'page' : undefined}
              onClick={() => onPageChange(item)}
            >
              {item}
            </Button>
          ),
        )}
        <Button
          size="icon"
          variant="outline"
          className="size-8"
          aria-label="Next page"
          disabled={current >= totalPages}
          onClick={() => onPageChange(current + 1)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
