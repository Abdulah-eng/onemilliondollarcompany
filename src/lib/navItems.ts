// src/lib/navItems.ts
import {
  Home,
  BookOpen,
  Library,
  TrendingUp,
  Users,
  Settings,
  Calendar,
  FileText,
  DollarSign,
  MessageSquare
} from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
  conditional?: boolean; // For items that should be conditionally shown
}

export const getCustomerNavItems = (showLibrary: boolean = true, showProgress: boolean = true): NavItem[] => {
  const baseItems: NavItem[] = [
    { name: 'Home', href: '/customer/dashboard', icon: Home },
    { name: 'My Programs', href: '/customer/programs', icon: BookOpen },
    { name: 'Messages', href: '/customer/messages', icon: MessageSquare },
    { name: 'My Coach', href: '/customer/my-coach', icon: Users },
    { name: 'Blog', href: '/customer/blog', icon: FileText },
  ];

  // Add Library if user has access
  if (showLibrary) {
    baseItems.splice(2, 0, { name: 'Library', href: '/customer/library', icon: Library, conditional: true });
  }

  // Always show Progress page - let AccessControl handle access restrictions
  const insertIndex = showLibrary ? 3 : 2; // Insert after Library or after My Programs
  baseItems.splice(insertIndex, 0, { name: 'Progress', href: '/customer/progress', icon: TrendingUp, conditional: true });

  return baseItems;
};

// Keep the old export for backward compatibility, but it will always show library
export const customerNavItems: NavItem[] = getCustomerNavItems(true);

export const customerBottomNavItems: NavItem[] = [
  { name: 'Settings', href: '/customer/settings', icon: Settings },
];

export const coachNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/coach/dashboard', icon: Home },
  { name: 'Clients', href: '/coach/clients', icon: Users },
  { name: 'Programs', href: '/coach/programs', icon: Calendar },
  { name: 'Library', href: '/coach/library', icon: Library },
  { name: 'Messages', href: '/coach/messages', icon: MessageSquare },
  { name: 'Blog', href: '/coach/blog', icon: FileText },
  { name: 'Income', href: '/coach/income', icon: DollarSign },
];

export const coachBottomNavItems: NavItem[] = [
  { name: 'Settings', href: '/coach/settings', icon: Settings },
];
