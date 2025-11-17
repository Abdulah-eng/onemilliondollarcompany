import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { LogOut, Crown, Users } from 'lucide-react';
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
import { useAccessLevel } from '@/contexts/AccessLevelContext';
import { NavItem } from '@/lib/navItems';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SideNavProps {
  navItems: NavItem[];
  bottomNavItems?: NavItem[];
}

const SideNav = ({ navItems, bottomNavItems = [] }: SideNavProps) => {
  const location = useLocation();
  const { signOut, profile } = useAuth();
  const { hasCoach, hasPaymentPlan } = useAccessLevel();
  const { state, isMobile, setOpen, setOpenMobile } = useSidebar();
  const collapsed = state === 'collapsed';

  const closeSidebar = () => {
    setOpen(false);
    setOpenMobile(false);
  };

  // Auto-close sidebar when route changes
  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

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

  const hasAccess = (item: NavItem): boolean => {
    if (!item.requiresAccess || item.requiresAccess === 'free') return true;
    if (item.requiresAccess === 'coach') return hasCoach || hasPaymentPlan;
    if (item.requiresAccess === 'payment') return hasPaymentPlan;
    return true;
  };

  const getAccessTooltip = (item: NavItem): string => {
    if (!item.requiresAccess || item.requiresAccess === 'free') return '';
    if (item.requiresAccess === 'coach') return 'Requires coach or subscription';
    if (item.requiresAccess === 'payment') return 'Requires subscription';
    return '';
  };

  const getAccessIcon = (item: NavItem) => {
    if (!item.requiresAccess || item.requiresAccess === 'free') return null;
    if (item.requiresAccess === 'payment') return <Crown className="h-3 w-3 text-orange-500" />;
    if (item.requiresAccess === 'coach') return <Users className="h-3 w-3 text-blue-500" />;
    return null;
  };

  return (
    <Sidebar
      className={cn(
        // ✅ Now identical to TopNav background
        "border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-foreground transition-all duration-300",
        collapsed && !isMobile ? 'w-16' : 'w-64'
      )}
      collapsible="icon"
    >
      <SidebarContent className="px-3">
        <div
          className={cn(
            "flex items-center h-16 border-b border-border",
            collapsed && !isMobile ? 'justify-center' : ''
          )}
        >
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
              <TooltipProvider>
                {navItems.map((item) => {
                  const itemHasAccess = hasAccess(item);
                  const accessIcon = getAccessIcon(item);
                  const tooltipText = getAccessTooltip(item);
                  
                  return (
                    <SidebarMenuItem key={item.href}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive(item.href)}
                            className={cn(btnClass, !itemHasAccess && 'opacity-60')}
                          >
                            <Link to={item.href} className="flex items-center gap-3 w-full" onClick={closeSidebar}>
                              <item.icon className="h-5 w-5 shrink-0" />
                              {showText && (
                                <span className="text-sm font-medium flex-1">{item.name}</span>
                              )}
                              {showText && accessIcon && !itemHasAccess && (
                                <span className="shrink-0">{accessIcon}</span>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        {tooltipText && !itemHasAccess && (
                          <TooltipContent side="right">
                            <p className="text-xs">{tooltipText}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </SidebarMenuItem>
                  );
                })}
              </TooltipProvider>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className={collapsed && !isMobile ? 'items-center' : ''}>
              <TooltipProvider>
                {bottomNavItems.map((item) => {
                  const itemHasAccess = hasAccess(item);
                  const accessIcon = getAccessIcon(item);
                  const tooltipText = getAccessTooltip(item);
                  
                  return (
                    <SidebarMenuItem key={item.href}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive(item.href)}
                            className={cn(btnClass, !itemHasAccess && 'opacity-60')}
                          >
                            <Link to={item.href} className="flex items-center gap-3 w-full" onClick={closeSidebar}>
                              <item.icon className="h-5 w-5 shrink-0" />
                              {showText && (
                                <span className="text-sm font-medium flex-1">{item.name}</span>
                              )}
                              {showText && accessIcon && !itemHasAccess && (
                                <span className="shrink-0">{accessIcon}</span>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        {tooltipText && !itemHasAccess && (
                          <TooltipContent side="right">
                            <p className="text-xs">{tooltipText}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </SidebarMenuItem>
                  );
                })}
              </TooltipProvider>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut} className={btnClass}>
                  <LogOut className="h-5 w-5 shrink-0" />
                  {showText && (
                    <span className="text-sm font-medium">Sign out</span>
                  )}
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
