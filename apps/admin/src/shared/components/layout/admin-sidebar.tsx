import {
  CalendarDays,
  ChartNoAxesCombined,
  ChefHat,
  Crown,
  ImageIcon,
  LayoutGrid,
  MessageSquare,
  Settings,
  Users,
  UtensilsCrossed,
  Wheat,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

import shanNoodles from '../../../../../mobile/src/features/home/assets/shan-noodles.png';
import { cn } from '@/shared/lib/utils';

const navigation = [
  { label: 'Dashboard', icon: LayoutGrid, to: '/' },
  { label: 'Recipes', icon: UtensilsCrossed, to: '/recipes' },
  { label: 'Ingredients', icon: Wheat, to: '/ingredients' },
  { label: 'Categories', icon: LayoutGrid, to: '/categories' },
  { label: 'Meal Plans', icon: CalendarDays, to: '/meal-plans' },
  { label: 'Subscriptions', icon: Crown, to: '/subscriptions' },
  { label: 'Analytics', icon: ChartNoAxesCombined, to: '/analytics' },
  { label: 'Settings', icon: Settings, to: '/settings' },
] as const;

export function AdminSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen flex-col overflow-hidden border-r border-border bg-sidebar px-3 py-6 lg:flex">
      <div className="flex items-center gap-3 px-3.5">
        <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
          <ChefHat className="size-5" />
        </span>
        <div>
          <p className="text-lg font-semibold leading-none tracking-tight">Burmese Recipe</p>
          <p className="mt-1 text-xs font-medium tracking-wide text-muted-foreground">ADMIN PANEL</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1.5" aria-label="Admin navigation">
        {navigation.map((item) => (
          <NavLink
            className={({ isActive }) =>
              cn(
                'flex h-12 items-center gap-4 rounded-lg px-4 text-left text-[15px] font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent',
              )
            }
            end={item.to === '/'}
            key={item.label}
            to={item.to}
          >
            <item.icon className="size-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
