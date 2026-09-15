import { ChefHat, Heart } from 'lucide-react';

const links = ['Privacy', 'Terms', 'Support', 'Docs'] as const;

export function AdminFooter() {
  return (
    <footer className="mt-10 border-t border-border">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 xl:px-8">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
            <ChefHat className="size-3.5" />
          </span>
          <p>© 2026 Burmese Recipe · Admin Panel</p>
        </div>
        <nav className="flex items-center gap-5" aria-label="Footer">
          {links.map((link) => (
            <a className="transition-colors hover:text-foreground" href="#" key={link}>
              {link}
            </a>
          ))}
        </nav>
        <p className="flex items-center gap-1.5 text-xs">
          Made with <Heart className="size-3.5 fill-primary text-primary" /> in Myanmar
        </p>
      </div>
    </footer>
  );
}
