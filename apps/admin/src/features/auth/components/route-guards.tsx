import { Loader2, ShieldAlert } from 'lucide-react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuthStore } from '@/features/auth/auth-store';
import { Button } from '@/shared/components/ui/button';

function FullScreenLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label="Loading" />
    </div>
  );
}

/**
 * Shown to a signed-in user who lacks the ADMIN role. We don't redirect to `/login`
 * (they're authenticated, so it would bounce back and loop) — instead we offer a way
 * out via sign-out, which clears the profile and lands them on the login page.
 */
function NotAuthorized() {
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <div className="grid min-h-screen place-items-center bg-background p-6">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="size-6" />
        </span>
        <div>
          <h1 className="text-lg font-semibold">Admin access required</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your account doesn’t have permission to use the admin panel.
          </p>
        </div>
        <Button variant="outline" onClick={() => void signOut()}>
          Sign out
        </Button>
      </div>
    </div>
  );
}

/**
 * Gate for the admin area. While the session is restoring we render a loader; once
 * resolved, signed-out visitors go to `/login` (remembering where they were headed),
 * and signed-in non-admins see a "not authorized" screen rather than the panel.
 */
export function ProtectedRoute() {
  const profile = useAuthStore((state) => state.profile);
  const isLoading = useAuthStore((state) => state.isLoading);
  const location = useLocation();

  if (isLoading) return <FullScreenLoader />;

  if (!profile) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (profile.role !== 'ADMIN') {
    return <NotAuthorized />;
  }

  return <Outlet />;
}

/**
 * Gate for auth-only pages (login/signup). Signed-in users are bounced to the
 * dashboard (or wherever they were originally headed) instead of seeing the form.
 */
export function PublicOnlyRoute() {
  const profile = useAuthStore((state) => state.profile);
  const isLoading = useAuthStore((state) => state.isLoading);
  const location = useLocation();

  if (isLoading) return <FullScreenLoader />;

  if (profile) {
    const to = (location.state as { from?: Location } | null)?.from?.pathname ?? '/';
    return <Navigate to={to} replace />;
  }

  return <Outlet />;
}
