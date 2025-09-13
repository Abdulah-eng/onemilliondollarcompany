import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Scale } from 'lucide-react';

interface WeightTrendProps {
  weightTrend: Array<{
    date: string;
    weight: number;
  }>;
}

const WeightTrend: React.FC<WeightTrendProps> = ({ weightTrend }) => {
  const chartData = weightTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: item.weight
  }));

  return (
    <div className="space-y-4">
      <CardHeader className="pb-3 px-0 pt-0">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Scale className="h-5 w-5 text-blue-500" />
          Weight Trend
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Track weight progression over time.
        </p>
      </CardHeader>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              className="text-muted-foreground"
              fontSize={12}
            />
            <YAxis 
              className="text-muted-foreground"
              fontSize={12}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value) => [`${value} lbs`, 'Weight']}
            />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              name="Weight"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeightTrend;