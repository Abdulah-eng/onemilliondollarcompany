// src/components/coach/dashboard/KeyMetrics.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/*
TODO: Backend Integration Notes
- `newClients`: Count new sign-ups in the last 30 days.
- `churnRate`: Calculated from `subscription` table.
- `avgAdherence`: Average of all client `adherence` metrics from `progression` table.
- `avgCheckInRate`: Average daily check-ins from `check_ins` table.
- `salesThisMonth`: Sum of all `Stripe` payments for the current month.
*/
const mockMetrics = [
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
];

const KeyMetrics = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">Key Metrics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockMetrics.map((metric) => (
          <Card key={metric.title} className="shadow-sm">
            <CardContent className="p-4 space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">{metric.title}</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">{metric.value}</p>
                <span className={cn(
                  "flex items-center text-xs font-semibold",
                  metric.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'
                )}>
                  {metric.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {metric.trendValue}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KeyMetrics;
