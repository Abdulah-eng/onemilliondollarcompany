import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import TopNav from './TopNav';
import SideNav from './SideNav';
import ErrorBoundary from '@/components/system/ErrorBoundary';
import { 
  NavItem, 
  coachNavItems, 
  coachBottomNavItems, 
  customerNavItems, 
  customerBottomNavItems,
  getCustomerNavItems
} from '@/lib/navItems';
import { useAuth } from '@/contexts/AuthContext';
import { useLibraryAccess } from '@/hooks/useLibraryAccess';
import { usePaymentPlan } from '@/hooks/usePaymentPlan';
import { AccessLevelProvider } from '@/contexts/AccessLevelContext';

const AppShell = () => {
  const { profile, loading } = useAuth();
  const { shouldShowLink } = useLibraryAccess();
  const { planStatus } = usePaymentPlan();

  if (loading) return <div>Loading...</div>;
  if (!profile) return null;

  const navByRole = {
    coach: { main: coachNavItems, bottom: coachBottomNavItems },
    customer: { main: getCustomerNavItems(shouldShowLink, true), bottom: customerBottomNavItems },
  };

  const navConfig = navByRole[profile.role as keyof typeof navByRole];
  const navItems: NavItem[] = navConfig.main;
  const bottomNavItems: NavItem[] = navConfig.bottom;

  return (
    <AccessLevelProvider>
      <SidebarProvider defaultOpen={false}>
        {/* ✅ UPDATED: Replaced solid background with a subtle gradient */}
        <div className="theme-dashboard min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-stone-100 dark:from-black dark:to-gray-900">
          <SideNav navItems={navItems} bottomNavItems={bottomNavItems} />
          <div className="flex-1 flex flex-col min-w-0">
            <TopNav />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AccessLevelProvider>
  );
};

export default AppShell;
