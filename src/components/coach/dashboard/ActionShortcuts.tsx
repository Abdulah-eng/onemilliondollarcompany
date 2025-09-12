// src/components/coach/dashboard/ActionShortcuts.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Users, BookMarked, Settings, FileText, LayoutList } from 'lucide-react';
import { cn } from '@/lib/utils';

const shortcuts = [
  {
    title: 'New Program',
    description: 'Start building a new program from scratch.',
    icon: Plus,
    href: '/coach/programBuilder',
    color: 'bg-emerald-500 hover:bg-emerald-600',
  },
  {
    title: 'Manage Clients',
    description: 'View client details, progress, and history.',
    icon: Users,
    href: '/coach/clients',
    color: 'bg-indigo-500 hover:bg-indigo-600',
  },
  {
    title: 'Edit Knowledge Hub',
    description: 'Update exercises, recipes, or mental tools.',
    icon: BookMarked,
    href: '/coach/knowledge-hub',
    color: 'bg-amber-500 hover:bg-amber-600',
  },
  {
    title: 'Review Blog',
    description: 'Write new blog posts and manage content.',
    icon: FileText,
    href: '/coach/blog',
    color: 'bg-rose-500 hover:bg-rose-600',
  },
];

const ActionShortcuts = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {shortcuts.map((shortcut) => (
          <Card key={shortcut.title} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 space-y-3">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white", shortcut.color)}>
                <shortcut.icon size={20} />
              </div>
              <h3 className="text-lg font-semibold">{shortcut.title}</h3>
              <p className="text-sm text-muted-foreground">{shortcut.description}</p>
              <Link href={shortcut.href}>
                <Button variant="ghost" className="p-0 h-auto text-primary">
                  Go to <LayoutList size={16} className="ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActionShortcuts;
