// src/components/customer/dashboard/QuickStats.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Flame, TrendingUp, BedDouble } from 'lucide-react';

const mockData = {
  streak: 7,
  sleepAvg: 'Good',
  energyTrend: 'up',
};

const QuickStats = () => {
  const { streak, sleepAvg, energyTrend } = mockData;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <StatCard icon={<Flame className="text-orange-500" />} label="Day Streak" value={`${streak} Days`} />
      <StatCard icon={<BedDouble className="text-blue-500" />} label="Sleep Trend" value={sleepAvg} />
      <StatCard icon={<TrendingUp className="text-emerald-500" />} label="Energy Level" value={energyTrend === 'up' ? 'Improving' : 'Stable'} />
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <Card className="bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
    {/* --- SIZE ADJUSTMENT --- */}
    <CardContent className="p-3 flex items-center gap-3">
      <div className="bg-gray-100 p-2 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-base font-bold text-gray-800">{value}</p>
      </div>
    </CardContent>
  </Card>
);

export default QuickStats;
