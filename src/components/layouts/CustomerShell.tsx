// src/components/layout/CustomerShell.tsx

import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import TopNav from './TopNav';
import SideNav from './SideNav';
import { customerNavItems, customerBottomNavItems } from '@/lib/navItems';

const CustomerShell = () => {
  return (
    <SidebarProvider>
      {/* THE FIX: Added the 'theme-dashboard' class and changed bg-gray-50 to bg-background */}
      <div className="theme-dashboard min-h-screen flex w-full bg-background">
        <SideNav navItems={customerNavItems} bottomNavItems={customerBottomNavItems} />
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

export default CustomerShell;
