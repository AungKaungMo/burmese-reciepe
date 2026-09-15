import { CalendarDays, ChevronDown } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

export function DashboardPage() {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold tracking-wider text-primary">DASHBOARD</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back, Admin!</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">Here’s an overview of your Burmese Recipe platform.</p>
      </div>
      <Button className="w-full justify-between sm:w-auto" variant="outline">
        <span className="flex items-center gap-2"><CalendarDays className="size-4" /> Sep 1, 2026 – Sep 30, 2026</span>
        <ChevronDown className="size-4" />
      </Button>
    </section>
  );
}
