// src/components/coach/clientCard/ClientProgress/DailyCheckIn.tsx
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Heart } from 'lucide-react';
import { TimeRange } from './TimeRangeSelector';

interface DailyCheckInProps {
  dailyCheckIn: {
    date: string;
    water: number;
    energy: number;
    sleep: number;
    mood: number;
  }[];
  timeRange: TimeRange;
}

// Custom Tooltip for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dateLabel = new Date(label).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return (
      <div className="bg-gray-800/95 dark:bg-white/95 backdrop-blur-sm p-3 rounded-lg border border-gray-600/50 dark:border-gray-300/50 shadow-lg min-w-[150px] text-white dark:text-gray-900">
        <p className="text-sm font-bold">{dateLabel}</p>
        <div className="mt-1 space-y-1">
          {payload.map((p, index) => (
            <div key={index} className="flex justify-between items-center text-xs">
              <span className="text-gray-400 dark:text-gray-600" style={{ color: p.stroke }}>
                {p.name}:
              </span>
              <span className="font-semibold" style={{ color: p.stroke }}>
                {p.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ dailyCheckIn, timeRange }) => {
  if (!dailyCheckIn || dailyCheckIn.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center p-6">
        <Heart size={48} className="text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground text-center">
          No daily check-in data available yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="text-xl font-bold tracking-tight text-foreground">
            Daily Check-ins ❤️
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            Consistency and trends in self-reported data
          </p>
        </div>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={dailyCheckIn}
            margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(str) =>
                new Date(str).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: 'rgba(100,100,100,0.2)', strokeWidth: 1 }}
            />
            <Area type="monotone" dataKey="water" name="Water" stroke="#3b82f6" fill="url(#colorWater)" />
            <Area type="monotone" dataKey="energy" name="Energy" stroke="#10b981" fill="url(#colorEnergy)" />
            <Area type="monotone" dataKey="sleep" name="Sleep" stroke="#f59e0b" fill="url(#colorSleep)" />
            <Area type="monotone" dataKey="mood" name="Mood" stroke="#8b5cf6" fill="url(#colorMood)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default DailyCheckIn;
