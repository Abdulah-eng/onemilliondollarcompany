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
  FolderOpen
} from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const customerNavItems: NavItem[] = [
  { name: 'Home', href: '/customer/dashboard', icon: Home },
  { name: 'My Programs', href: '/customer/programs', icon: BookOpen },
  { name: 'Library', href: '/customer/library', icon: Library },
  // --- FIX: Added the missing colon after 'name' ---
  { name: 'Progress', href: '/customer/progress', icon: TrendingUp },
  { name: 'My Coach', href: '/customer/my-coach', icon: Users },
  { name: 'Blog', href: '/customer/blog', icon: FileText },
];

export const customerBottomNavItems: NavItem[] = [
  { name: 'Settings', href: '/customer/settings', icon: Settings },
];

export const coachNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/coach/dashboard', icon: Home },
  { name: 'Clients', href: '/coach/clients', icon: Users },
  { name: 'Programs', href: '/coach/programs', icon: Calendar },
  { name: 'Library', href: '/coach/library', icon: Library },
  { name: 'Blog', href: '/coach/blog', icon: FileText },
  { name: 'Files', href: '/coach/files', icon: FolderOpen },
];

export const coachBottomNavItems: NavItem[] = [
  { name: 'Settings', href: '/customer/settings', icon: Settings },
];
