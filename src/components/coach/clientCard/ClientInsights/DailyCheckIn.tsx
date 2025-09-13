import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

interface DailyCheckInProps {
  dailyCheckIn: Array<{
    date: string;
    water: number;
    energy: number;
    sleep: number;
    mood: number;
    stress: number;
    anxiety: number;
    meditationTime: number;
    yogaTime: number;
    portionTracking: number;
    ateOutside: boolean;
  }>;
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ dailyCheckIn }) => {
  const chartData = dailyCheckIn.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    mood: item.mood,
    sleep: item.sleep,
    energy: item.energy,
    stress: item.stress
  }));

  return (
    <div className="space-y-4">
      <CardHeader className="pb-3 px-0 pt-0">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Daily Check-ins
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Track mood, sleep, energy, and stress levels over time.
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
              domain={[1, 10]}
              className="text-muted-foreground"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="mood" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              name="Mood"
            />
            <Line 
              type="monotone" 
              dataKey="sleep" 
              stroke="hsl(var(--secondary))" 
              strokeWidth={2}
              name="Sleep"
            />
            <Line 
              type="monotone" 
              dataKey="energy" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Energy"
            />
            <Line 
              type="monotone" 
              dataKey="stress" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Stress"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailyCheckIn;