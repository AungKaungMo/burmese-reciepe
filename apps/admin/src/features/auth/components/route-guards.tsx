import { Loader2 } from 'lucide-react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuthStore } from '@/features/auth/auth-store';

function FullScreenLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label="Loading" />
    </div>
  );
}

/**
 * Gate for authenticated areas. While the session is restoring we render a loader;
 * once resolved, signed-out visitors are sent to `/login` (remembering where they
 * were headed so login can send them back).
 */
export function ProtectedRoute() {
  const profile = useAuthStore((state) => state.profile);
  const isLoading = useAuthStore((state) => state.isLoading);
  const location = useLocation();

  if (isLoading) return <FullScreenLoader />;

  if (!profile) {
    return <Navigate to="/login" replace state={{ from: location }} />;
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
