// src/components/customer/dashboard/QuickStats.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Flame, TrendingUp, BedDouble } from 'lucide-react';

/*
TODO: Backend Integration Notes for QuickStats
- `streak`: Calculate the user's current workout streak from the `activity_logs` table.
- `sleepAvg`: Calculate the average sleep rating from the `daily_logs` table for the last 7 days.
- `energyTrend`: Compare the average energy rating from the last 3 days to the 3 days prior from `daily_logs`.
*/
const mockData = {
  streak: 7,
  sleepAvg: 'Good',
  energyTrend: 'up',
};

const QuickStats = () => {
  const { streak, sleepAvg, energyTrend } = mockData;

  return (
    <Card className="bg-white shadow-md">
      <CardContent className="p-4 grid grid-cols-3 divide-x divide-gray-200">
        <StatItem
          icon={<Flame className="text-orange-500" />}
          label="Day Streak"
          value={`${streak} Days`}
        />
        <StatItem
          icon={<BedDouble className="text-blue-500" />}
          label="Sleep Trend"
          value={sleepAvg}
        />
        <StatItem
          icon={<TrendingUp className="text-emerald-500" />}
          label="Energy Level"
          value={energyTrend === 'up' ? 'Improving' : 'Stable'}
        />
      </CardContent>
    </Card>
  );
};

const StatItem = ({ icon, label, value }) => (
  <div className="px-4 flex items-center gap-3">
    <div className="bg-gray-100 p-2 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-base font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default QuickStats;
