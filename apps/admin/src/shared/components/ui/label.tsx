import type * as React from 'react';

import { cn } from '@/shared/lib/utils';

function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      className={cn('flex items-center gap-1 text-sm font-medium text-foreground', className)}
      {...props}
    />
  );
}

export { Label };
