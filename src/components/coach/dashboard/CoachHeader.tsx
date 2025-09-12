// src/components/coach/dashboard/CoachHeader.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Users, BookOpenCheck, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/*
TODO: Backend Integration Notes
- [cite_start]`coachName`: This is a static value ("Train Wise") as there is only one coach[cite: 167].
- `totalClients`: Fetch count of 'customer' roles from `profiles` table.
- `activePrograms`: Fetch count of 'Tailored' and 'Scheduled' programs from `program_assignments` table.
- `newClients`: Count new sign-ups in the last 30 days.
- `churnRate`: Calculated from `subscription` table.
- `avgAdherence`: Average of all client `adherence` metrics from `progression` table.
- `avgCheckInRate`: Average daily check-ins from `check_ins` table.
*/
const mockData = {
  coachName: 'Train Wise',
  totalClients: 48,
  activePrograms: 32,
  metrics: [
    {
      title: 'New Clients (30d)',
      value: 12,
      trend: 'up',
      trendValue: '+25%',
      description: 'Compared to last month',
    },
    {
      title: 'Subscription Churn Rate',
      value: '3.1%',
      trend: 'down',
      trendValue: '-1.2%',
      description: 'Average monthly churn',
    },
    {
      title: 'Avg. Program Adherence',
      value: '88%',
      trend: 'up',
      trendValue: '+2%',
      description: 'How well clients follow programs',
    },
    {
      title: 'Avg. Daily Check-in Rate',
      value: '92%',
      trend: 'up',
      trendValue: '+5%',
      description: 'Clients logging their data',
    },
  ],
};

const CoachHeader = () => {
  const { coachName, totalClients, activePrograms, metrics } = mockData;
  const timeOfDay = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening';

  const StatCard = ({ title, value, trend, trendValue, description }) => {
    return (
      <Card className="min-w-[180px] flex-1 shadow-sm bg-background border">
        <CardContent className="p-4 space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
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
      <Card className="relative border-none bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-lg animate-fade-in-down overflow-hidden">
        <CardContent className="p-6">
          <div className="pr-28">
            <h1 className="text-2xl font-bold">Good {timeOfDay}, {coachName} 👋</h1>
            <p className="opacity-80 mt-1 text-sm italic">"Ready to make an impact today?"</p>
          </div>
          
          {/* Stats Badge in top right corner */}
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2 text-right">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Users size={16} className="text-white" />
              <span className="font-bold text-sm">{totalClients}</span>
              <span className="text-xs opacity-80">Clients</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
              <BookOpenCheck size={16} className="text-white" />
              <span className="font-bold text-sm">{activePrograms}</span>
              <span className="text-xs opacity-80">Active Programs</span>
            </div>
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
