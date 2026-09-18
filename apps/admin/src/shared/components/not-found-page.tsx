import { FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';

/** Standalone 404 for unknown in-app routes (paths under /admin that match nothing). */
export function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-background p-6">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
          <FileQuestion className="size-6" />
        </span>
        <div>
          <h1 className="text-lg font-semibold">Page not found</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The page you’re looking for doesn’t exist or has moved.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
