import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { queryClient } from '@/app/query-client';
import { initializeAuth } from '@/features/auth/auth-store';
import { AuthPage } from '@/features/auth/components/auth-page';
import { PublicOnlyRoute, ProtectedRoute } from '@/features/auth/components/route-guards';
import { PlaceholderPage } from '@/shared/components/placeholder-page';
import { Toaster } from '@/shared/components/ui/sonner';
import { AdminLayout } from '@/shared/components/layout/admin-layout';
import { CategoriesPage } from '@/features/categories/components/categories-page';
import { CategoryCreatePage } from '@/features/categories/components/category-create-page';
import { CategoryEditPage } from '@/features/categories/components/category-edit-page';
import { RecipesPage } from '@/features/recipes/components/recipes-page';
import { DashboardPage } from '@/features/dashboard/components/dashboard-page';

export function App() {
  // Restore the session and subscribe to Supabase auth events once, on startup.
  useEffect(() => initializeAuth(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Auth-only pages: signed-in users are redirected to the dashboard. */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<AuthPage />} />
          </Route>

          {/* Everything below requires an authenticated session. */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/new" element={<CategoryCreatePage />} />
              <Route path="/categories/:id/edit" element={<CategoryEditPage />} />
              <Route path="/recipes" element={<RecipesPage />} />
              <Route path="/ingredients" element={<PlaceholderPage title="Ingredients" />} />
              <Route path="/meal-plans" element={<PlaceholderPage title="Meal Plans" />} />
              <Route path="/subscriptions" element={<PlaceholderPage title="Subscriptions" />} />
              <Route path="/users" element={<PlaceholderPage title="Users" />} />
              <Route path="/media" element={<PlaceholderPage title="Media" />} />
              <Route path="/comments" element={<PlaceholderPage title="Comments" />} />
              <Route path="/analytics" element={<PlaceholderPage title="Analytics" />} />
              <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}
