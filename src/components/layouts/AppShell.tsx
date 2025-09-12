import { Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import TopNav from './TopNav';
import SideNav from './SideNav';
import ErrorBoundary from '@/components/system/ErrorBoundary';
import ClientFilters from '@/components/coach/client-overview/ClientFilters';
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
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  if (!profile) return null;

  const navByRole = {
    coach: { main: coachNavItems, bottom: coachBottomNavItems },
    customer: { main: customerNavItems, bottom: customerBottomNavItems },
  };

  const navConfig = navByRole[profile.role as keyof typeof navByRole];
  const navItems: NavItem[] = navConfig.main;
  const bottomNavItems: NavItem[] = navConfig.bottom;

  // Show ClientFilters on coach client overview page
  const showClientFilters = profile.role === 'coach' && location.pathname === '/coach/client-overview';

  return (
    <SidebarProvider defaultOpen={false}>
      {/* ✅ UPDATED: Replaced solid background with a subtle gradient */}
      <div className="theme-dashboard min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-stone-100 dark:from-black dark:to-gray-900">
        <SideNav navItems={navItems} bottomNavItems={bottomNavItems} />
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav />
          {showClientFilters && <ClientFilters />}
          <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto ${showClientFilters ? 'mt-20' : ''}`}>
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppShell;
