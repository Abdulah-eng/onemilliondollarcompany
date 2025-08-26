// src/components/layouts/AppShell.tsx
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import TopNav from './TopNav';
import SideNav from './SideNav';
import { 
  NavItem, 
  coachNavItems, 
  coachBottomNavItems, 
  customerNavItems, 
  customerBottomNavItems 
} from '@/lib/navItems';
import { useAuth } from '@/contexts/AuthContext';

const AppShell = () => {
  const { profile, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!profile) return null; // This should never render; public pages handled elsewhere

  const navByRole = {
    coach: { main: coachNavItems, bottom: coachBottomNavItems },
    customer: { main: customerNavItems, bottom: customerBottomNavItems },
  };

  const navConfig = navByRole[profile.role as keyof typeof navByRole];
  const navItems: NavItem[] = navConfig.main;
  const bottomNavItems: NavItem[] = navConfig.bottom;

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