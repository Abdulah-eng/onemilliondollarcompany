import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import ProgramFill from './ProgramFill';
import DailyCheckIn from './DailyCheckIn';
import WeightTrend from './WeightTrend';
import TimeRangeSelector, { TimeRange } from './TimeRangeSelector';

// MOCK DATA
const mockDailyCheckIn = [
  { date: '2025-09-01', mood: 4, sleep: 7, water: 2 },
  { date: '2025-09-02', mood: 5, sleep: 8, water: 3 },
  { date: '2025-09-03', mood: 3, sleep: 6, water: 1 },
];

const mockWeightTrend = [
  { date: '2025-08-01', weight: 70 },
  { date: '2025-08-15', weight: 69.5 },
  { date: '2025-09-01', weight: 69 },
];

const mockProgramFill = { fitness: 75, nutrition: 50, mentalHealth: 80 };

const mockProgressPhotos = [
  { url: '/images/progress1.jpg', taken_at: '2025-09-01', is_newest_overall: false },
  { url: '/images/progress2.jpg', taken_at: '2025-09-05', is_newest_overall: true },
];

const mockTrends = { mood: '↑', sleep: '→', water: '↓', energy: '↑' };

interface ClientProgressProps {}

const ClientProgress: React.FC<ClientProgressProps> = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1month');

  const filterDataByTimeRange = (data: any[]) => {
    // mock: no real filter for simplicity
    return data;
  };

  const filteredDailyCheckIn = useMemo(() => filterDataByTimeRange(mockDailyCheckIn), [timeRange]);
  const filteredWeightTrend = useMemo(() => filterDataByTimeRange(mockWeightTrend), [timeRange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-0">Progress & Insights 📈</h3>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg rounded-xl bg-card p-6">
          <ProgramFill programFill={mockProgramFill} />
        </Card>
        <Card className="shadow-lg rounded-xl bg-card p-6">
          <DailyCheckIn dailyCheckIn={filteredDailyCheckIn} timeRange={timeRange} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-lg rounded-xl bg-card p-6">
          <WeightTrend weightTrend={filteredWeightTrend} nextFollowUp={'2025-09-20'} timeRange={timeRange} />
        </Card>
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 h-96 rounded-xl shadow-lg flex flex-col items-center justify-center text-muted-foreground">
          <div className="text-lg font-semibold mb-3">Progress Photos</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {mockProgressPhotos.map((p, idx) => (
              <div key={idx} className="space-y-2">
                <div className={`aspect-square w-full overflow-hidden rounded-xl ${p.is_newest_overall ? 'ring-2 ring-primary' : 'ring-1 ring-border'}`}>
                  <img src={p.url} alt={`Progress ${p.taken_at}`} className="h-full w-full object-cover" />
                </div>
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>{p.taken_at}</span>
                  {p.is_newest_overall && <span className="text-primary font-semibold">Newest</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="shadow-lg rounded-xl bg-card p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(mockTrends).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between rounded-xl bg-muted/30 px-3 py-2">
              <span className="text-sm text-muted-foreground">{k.charAt(0).toUpperCase() + k.slice(1)}</span>
              <span className={`text-base font-semibold ${v === '↑' ? 'text-emerald-600' : v === '↓' ? 'text-rose-600' : 'text-muted-foreground'}`}>{v}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default ClientProgress;
