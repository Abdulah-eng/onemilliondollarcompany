// src/components/layouts/AppShell.tsx

import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import TopNav from './TopNav';
import SideNav from './SideNav';
import { 
  customerNavItems, 
  customerBottomNavItems, 
  coachNavItems, 
  coachBottomNavItems
} from '@/lib/navItems';

const AppShell = () => {
  const { profile } = useAuth();

  const { navItems, bottomNavItems } = useMemo(() => {
    if (profile?.role === 'coach') {
      return {
        navItems: coachNavItems,
        bottomNavItems: coachBottomNavItems,
      };
    }
    // Default to customer navigation
    return {
      navItems: customerNavItems,
      bottomNavItems: customerBottomNavItems,
    };
  }, [profile?.role]);

  return (
    <SidebarProvider>
      <div className="theme-dashboard min-h-screen flex w-full bg-background">
        <SideNav navItems={navItems} bottomNavItems={bottomNavItems} />
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppShell;
