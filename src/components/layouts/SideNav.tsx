// src/components/layout/SideNav.tsx
import { Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { NavItem } from '@/lib/navItems';

interface SideNavProps {
  navItems: NavItem[];
  bottomNavItems?: NavItem[];
}

const SideNav = ({ navItems, bottomNavItems = [] }: SideNavProps) => {
  const location = useLocation();
  const { signOut } = useAuth();
  const { state, isMobile } = useSidebar();
  const collapsed = state === 'collapsed';

  const isActive = (href: string) => location.pathname === href;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const showText = isMobile || !collapsed;
  const btnClass = collapsed && !isMobile ? 'justify-center px-0' : 'justify-start';

  return (
    <Sidebar
      className={`transition-all duration-300 ${collapsed && !isMobile ? 'w-16' : 'w-64'}`}
      collapsible="icon"
    >
      <SidebarContent className="px-3">
        <div className={`border-b py-4 ${collapsed && !isMobile ? 'flex items-center justify-center' : ''}`}>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 min-h-10 min-w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm leading-none">TW</span>
            </div>
            {showText && <span className="font-bold text-lg text-foreground">TrainWise</span>}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className={collapsed && !isMobile ? 'items-center' : ''}>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)} className={btnClass}>
                    <Link to={item.href} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 shrink-0" />
                      {showText && <span className="text-sm font-medium">{item.name}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className={collapsed && !isMobile ? 'items-center' : ''}>
              {bottomNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)} className={btnClass}>
                    <Link to={item.href} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 shrink-0" />
                      {showText && <span className="text-sm font-medium">{item.name}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut} className={btnClass}>
                  <LogOut className="h-5 w-5 shrink-0" />
                  {showText && <span className="text-sm font-medium">Sign out</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideNav;
