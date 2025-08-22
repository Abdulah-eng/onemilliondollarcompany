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

  const stats = [
    { icon: <Flame className="text-orange-500" />, label: "Day Streak", value: `${streak} Days` },
    { icon: <BedDouble className="text-blue-500" />, label: "Sleep Trend", value: sleepAvg },
    { icon: <TrendingUp className="text-emerald-500" />, label: "Energy Level", value: energyTrend === 'up' ? 'Improving' : 'Stable' }
  ];

  return (
    // This container handles the responsive layout
    <div className="md:grid md:grid-cols-3 md:gap-4">
      {/* On mobile, this will be a horizontal scroll container */}
      <div className="md:col-span-3 flex md:grid md:grid-cols-3 gap-4 overflow-x-auto pb-2 -mb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {stats.map((stat, index) => (
          <StatCard key={index} icon={stat.icon} label={stat.label} value={stat.value} />
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  // Each card has a minimum width for scrolling, but is flexible for the grid
  <div className="min-w-[200px] md:min-w-0 flex-1">
    <Card className="bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 h-full">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="bg-gray-100 p-3 rounded-full">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default QuickStats;
