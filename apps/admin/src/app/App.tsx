import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { queryClient } from '@/app/query-client';
import { initializeAuth } from '@/features/auth/auth-store';
import { AuthPage } from '@/features/auth/components/auth-page';
import { PublicOnlyRoute, ProtectedRoute } from '@/features/auth/components/route-guards';
import { PlaceholderPage } from '@/shared/components/placeholder-page';
import { ConfirmDialogHost } from '@/shared/components/confirm-dialog';
import { Toaster } from '@/shared/components/ui/sonner';
import { AdminLayout } from '@/shared/components/layout/admin-layout';
import { CategoriesPage } from '@/features/categories/components/categories-page';
import { CategoryCreatePage } from '@/features/categories/components/category-create-page';
import { CategoryEditPage } from '@/features/categories/components/category-edit-page';
import { RecipesPage } from '@/features/recipes/components/recipes-page';
import { RecipeCreatePage } from '@/features/recipes/components/recipe-create-page';
import { RecipeEditPage } from '@/features/recipes/components/recipe-edit-page';
import { IngredientsPage } from '@/features/ingredients/components/ingredients-page';
import { IngredientCreatePage } from '@/features/ingredients/components/ingredient-create-page';
import { IngredientEditPage } from '@/features/ingredients/components/ingredient-edit-page';
import { MeasurementUnitsPage } from '@/features/measurement-units/components/measurement-units-page';
import { MeasurementUnitCreatePage } from '@/features/measurement-units/components/measurement-unit-create-page';
import { MeasurementUnitEditPage } from '@/features/measurement-units/components/measurement-unit-edit-page';
import { NutrientsPage } from '@/features/nutrients/components/nutrients-page';
import { NutrientCreatePage } from '@/features/nutrients/components/nutrient-create-page';
import { NutrientEditPage } from '@/features/nutrients/components/nutrient-edit-page';
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
              <Route path="/recipes/new" element={<RecipeCreatePage />} />
              <Route path="/recipes/:id/edit" element={<RecipeEditPage />} />
              <Route path="/ingredients" element={<IngredientsPage />} />
              <Route path="/ingredients/new" element={<IngredientCreatePage />} />
              <Route path="/ingredients/:id/edit" element={<IngredientEditPage />} />
              <Route path="/measurement-units" element={<MeasurementUnitsPage />} />
              <Route path="/measurement-units/new" element={<MeasurementUnitCreatePage />} />
              <Route path="/measurement-units/:id/edit" element={<MeasurementUnitEditPage />} />
              <Route path="/nutrients" element={<NutrientsPage />} />
              <Route path="/nutrients/new" element={<NutrientCreatePage />} />
              <Route path="/nutrients/:id/edit" element={<NutrientEditPage />} />
              <Route path="/subscriptions" element={<PlaceholderPage title="Subscriptions" />} />
              <Route path="/analytics" element={<PlaceholderPage title="Analytics" />} />
              <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
      <ConfirmDialogHost />
    </QueryClientProvider>
  );
}
