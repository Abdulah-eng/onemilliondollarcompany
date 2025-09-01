// src/components/customer/progress/StatCard.tsx
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
  colorClass: string;
}

export default function StatCard({ icon, title, value, trend, colorClass }: StatCardProps) {
  return (
    <div className="bg-card dark:bg-[#0d1218] p-4 rounded-xl border border-border/50 flex items-center gap-4">
      <div className={cn("flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center", colorClass)}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-xl font-bold">{value}</p>
        {trend && (
          <div className="flex items-center text-xs text-muted-foreground">
            {trend.direction === 'up' ? <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" /> : <TrendingDown className="h-3 w-3 mr-1 text-red-500" />}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
}
