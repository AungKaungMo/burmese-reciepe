import { Bell, LogOut, Menu, Moon, Search, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/features/auth/auth-store';
import { Button } from '@/shared/components/ui/button';

export function AdminNavbar() {
  const profile = useAuthStore((state) => state.profile);
  const signOut = useAuthStore((state) => state.signOut);
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const displayName = profile?.displayName ?? profile?.email ?? 'Admin';
  const initial = displayName.charAt(0).toUpperCase();

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut();
      navigate('/login', { replace: true });
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-[4.8rem] items-center gap-3 border-b border-border bg-card/90 px-4 shadow-[0_1px_7px_rgb(43_33_27/0.04)] backdrop-blur sm:px-6 xl:px-8">
      <Button className="lg:hidden" size="icon" variant="outline" aria-label="Open navigation">
        <Menu className="size-4" />
      </Button>
      <div className="flex h-10 max-w-[46.25rem] flex-1 items-center gap-3 rounded-lg border bg-muted/40 px-3 shadow-xs">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          aria-label="Search"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          placeholder="Search recipes, ingredients, users..."
        />
        <kbd className="hidden rounded bg-muted px-2 py-1 text-[11px] text-muted-foreground sm:block">⌘ K</kbd>
      </div>
      <Button className="hidden sm:inline-flex" size="icon" variant="ghost" aria-label="Toggle color theme" onClick={() => setDark((current) => !current)}>
        {dark ? <Moon className="size-5" /> : <Sun className="size-5" />}
      </Button>
      <Button className="relative hidden sm:inline-flex" size="icon" variant="ghost" aria-label="Notifications">
        <Bell className="size-5" />
        <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
      </Button>
      <div className="hidden h-8 w-px bg-border sm:block" />
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
          {initial}
        </span>
        <div className="hidden leading-tight md:block">
          <p className="text-sm font-semibold">{displayName}</p>
          <p className="text-xs text-muted-foreground">{profile?.role ?? 'Administrator'}</p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Sign out"
          title="Sign out"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut className="size-5" />
        </Button>
      </div>
    </header>
  );
}
