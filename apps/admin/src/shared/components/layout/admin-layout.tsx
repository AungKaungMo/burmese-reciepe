import { Outlet } from 'react-router-dom';

import { AdminFooter } from '@/shared/components/layout/admin-footer';
import { AdminNavbar } from '@/shared/components/layout/admin-navbar';
import { AdminSidebar } from '@/shared/components/layout/admin-sidebar';

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[16.75rem_minmax(0,1fr)]">
      <AdminSidebar />
      <main className="flex min-h-screen min-w-0 flex-col">
        <AdminNavbar />
        <div className="mx-auto w-full max-w-360 flex-1 p-4 sm:p-6 xl:p-8">
          <Outlet />
        </div>
        <AdminFooter />
      </main>
    </div>
  );
}
