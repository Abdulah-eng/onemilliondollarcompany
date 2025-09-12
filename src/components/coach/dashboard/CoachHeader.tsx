// src/components/coach/dashboard/CoachHeader.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Users, BookOpenCheck, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/*
TODO: Backend Integration Notes
- [cite_start]`coachName`: This is a static value ("Train Wise") as there is only one coach[cite: 167].
- All metrics should be fetched and dynamically updated.
*/
const mockData = {
  coachName: 'Train Wise',
  metrics: [
    {
      title: 'Total Clients',
      value: '1,004',
      icon: Users,
      trend: 'up',
      trendValue: '+25%',
      description: 'Since last month',
    },
    {
      title: 'Total Earning',
      value: '$29.4K',
      icon: DollarSign,
      trend: 'up',
      trendValue: '10%',
      description: 'Updated last month',
    },
    {
      title: 'Active Programs',
      value: '502',
      icon: BookOpenCheck,
      trend: 'up',
      trendValue: '+5%',
      description: 'Active clients',
    },
    {
      title: 'Retention Rate',
      value: '78%',
      icon: TrendingUp,
      trend: 'up',
      trendValue: '+2%',
      description: 'Monthly retention',
    },
  ],
};

const CoachHeader = () => {
  const { coachName, metrics } = mockData;
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
            <h1 className="text-2xl font-bold">Good {timeOfDay}, {coachName} 👋</h1>
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
