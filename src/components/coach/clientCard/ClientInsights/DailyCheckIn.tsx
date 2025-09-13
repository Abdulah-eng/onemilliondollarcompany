import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DailyCheckInProps {
  dailyCheckIn: any[];
  timeRange: '1week' | '1month' | '6months';
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ dailyCheckIn, timeRange }) => {
  const filteredData = useMemo(() => {
    if (!dailyCheckIn || dailyCheckIn.length === 0) return [];
    
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (timeRange) {
      case '1week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '1month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case '6months':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
    }
    
    return dailyCheckIn
      .filter((entry) => new Date(entry.date) >= cutoffDate)
      .map((entry) => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: entry.mood || 0,
        energy: entry.energy || 0,
        sleep: entry.sleep || 0,
        water: entry.water || 0,
      }))
      .slice(-10); // Show last 10 entries
  }, [dailyCheckIn, timeRange]);

  if (filteredData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No check-in data available for this period</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={filteredData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
            axisLine={false} 
            tickLine={false} 
          />
          <YAxis 
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
            axisLine={false} 
            tickLine={false}
            domain={[0, 10]}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="mood" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
            name="Mood"
          />
          <Line 
            type="monotone" 
            dataKey="energy" 
            stroke="hsl(var(--destructive))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 3 }}
            name="Energy"
          />
          <Line 
            type="monotone" 
            dataKey="sleep" 
            stroke="hsl(var(--secondary))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 3 }}
            name="Sleep"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyCheckIn;