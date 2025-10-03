// src/components/coach/dashboard/CoachHeader.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Users, BookOpenCheck, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCoachDashboardStats } from '@/hooks/useCoachDashboard';

const CoachHeader = () => {
  const { stats } = useCoachDashboardStats();
  const metrics = [
    { title: 'Total Clients', value: String(stats.totalClients), icon: Users, trend: 'up', trendValue: '', description: 'Since last month' },
    { title: 'Total Earning', value: `$${stats.totalEarning.toLocaleString()}`, icon: DollarSign, trend: 'up', trendValue: '', description: 'All time net' },
    { title: 'Active Programs', value: String(stats.activePrograms), icon: BookOpenCheck, trend: 'up', trendValue: '', description: 'Active clients' },
    { title: 'Retention Rate', value: `${stats.retentionRate}%`, icon: TrendingUp, trend: 'up', trendValue: '', description: 'Subscribed customers' },
  ];
  const timeOfDay = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening';

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, description }) => {
    return (
      <Card className="min-w-[180px] flex-1 shadow-md border rounded-xl">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            {Icon && <Icon size={16} className="text-muted-foreground" />}
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-bold">{value}</p>
            <span className={cn(
              "flex items-center text-xs font-semibold",
              trend === 'up' ? 'text-emerald-500' : 'text-rose-500'
            )}>
              {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {trendValue}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate">{description}</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="relative border-none bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-lg animate-fade-in-down overflow-hidden rounded-xl">
        <CardContent className="p-6">
          <div className="pr-28">
            <h1 className="text-2xl font-bold">Good {timeOfDay}, Coach 👋</h1>
            <p className="opacity-80 mt-1 text-sm italic">"Ready to make an impact today?"</p>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Section */}
      <div className="p-1 -m-1">
        <div className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {metrics.map((metric, index) => (
            <StatCard key={index} {...metric} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoachHeader;
