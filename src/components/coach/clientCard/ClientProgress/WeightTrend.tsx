// src/components/coach/clientCard/ClientProgress/WeightTrend.tsx
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Scale } from 'lucide-react';

interface WeightTrendProps {
  weightTrend: {
    date: string;
    weight: number;
  }[];
  nextFollowUp: string;
}

// Custom Tooltip for the chart
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const dateLabel = new Date(label).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return (
      <div className="bg-gray-800/95 dark:bg-white/95 backdrop-blur-sm p-3 rounded-lg border border-gray-600/50 dark:border-gray-300/50 shadow-lg min-w-[150px] text-white dark:text-gray-900">
        <p className="text-sm font-bold">{dateLabel}</p>
        <div className="flex justify-between items-center text-xs mt-1">
          <span className="text-gray-400 dark:text-gray-600">Weight:</span>
          <span className="font-semibold text-orange-400 dark:text-orange-600">
            {payload[0].value?.toFixed(1)} kg
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const WeightTrend: React.FC<WeightTrendProps> = ({ weightTrend, nextFollowUp }) => {
  if (!weightTrend || weightTrend.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center h-64">
        <Scale size={48} className="text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground text-center">No weight data available yet.</p>
      </div>
    );
  }

  // Convert string dates to timestamps for Recharts numerical axis
  const chartData = weightTrend.map(d => ({
    ...d,
    timestamp: new Date(d.date).getTime(),
  }));

  const timestamps = chartData.map(d => d.timestamp);
  const minTs = Math.min(...timestamps);
  const maxTs = Math.max(...timestamps);
  const padding = (maxTs - minTs) * 0.1;

  return (
    <div className="bg-white dark:bg-[#1f2937] rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-lg dark:shadow-none">
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
          <Scale className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="text-xl font-bold tracking-tight text-foreground">Weight Trend ⚖️</h4>
          <p className="text-sm text-muted-foreground mt-1">Progress towards your weight goals</p>
        </div>
      </div>
      
      <div className="h-60 w-full overflow-hidden -mx-6 sm:-mx-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={[minTs - padding, maxTs + padding]}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              allowDuplicatedCategory={false}
              interval="preserveEnd"
              tickFormatter={(ts) =>
                new Date(ts).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: 'rgba(100,100,100,0.2)', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="weight"
              stroke="#2563eb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorWeight)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm text-muted-foreground mt-2 text-center">Next Follow-up: <span className="font-semibold text-foreground">{nextFollowUp}</span></p>
    </div>
  );
};

export default WeightTrend;
