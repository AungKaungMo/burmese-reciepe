import { QueryClient } from '@tanstack/react-query';

/**
 * App-wide react-query client. Created once outside React so the cache survives
 * re-renders. Categories and other admin resources refetch on demand rather than
 * on every window focus, which suits a low-churn admin panel.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
