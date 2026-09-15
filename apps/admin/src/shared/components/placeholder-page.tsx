import { Construction } from 'lucide-react';

import { Card } from '@/shared/components/ui/card';

type PlaceholderPageProps = {
  title: string;
};

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <Card className="mt-6 flex flex-col items-center justify-center gap-3 p-16 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
          <Construction className="size-6" />
        </span>
        <p className="text-sm text-muted-foreground">This section is coming soon.</p>
      </Card>
    </>
  );
}
