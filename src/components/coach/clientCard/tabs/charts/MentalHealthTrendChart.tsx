import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MentalHealthTrendChartProps {
  data: any[];
  selectedRange: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    if (!data) return null;

    return (
      <div className="bg-white/95 p-4 rounded-xl shadow-xl backdrop-blur-md border border-gray-200/50 text-gray-800 min-w-[280px]">
        <div className="border-b border-gray-200/50 pb-2 mb-3">
          <p className="font-bold text-sm text-gray-800">{label}</p>
          <p className="text-xs text-gray-600">Mental Health Overview</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">🧘‍♀️ Meditation:</span>
            <span className="font-semibold text-sm text-primary">{data.meditation}min</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">😴 Sleep Quality:</span>
            <span className="font-semibold text-sm text-blue-600">{data.sleep}hrs</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">⚡ Energy Level:</span>
            <span className="font-semibold text-sm text-green-600">{data.energy}/10</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">😰 Stress Level:</span>
            <span className="font-semibold text-sm text-orange-500">{data.stress}/10</span>
          </div>
        </div>

        {data.meditation > 0 && (
          <div className="mt-3 pt-2 border-t border-gray-200/50">
            <p className="text-xs text-gray-600">🎯 Daily Progress</p>
            <p className="text-xs text-green-600 font-medium">Meditation goal achieved!</p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const MentalHealthTrendChart: React.FC<MentalHealthTrendChartProps> = ({ data, selectedRange }) => {
  const filteredData = useMemo(() => {
    const now = new Date();
    let rangeInDays = 7;
    if (selectedRange === '1m') rangeInDays = 30;
    if (selectedRange === '6m') rangeInDays = 180;

    return data.filter(d => {
      const date = new Date(d.date);
      const diffInTime = now.getTime() - date.getTime();
      const diffInDays = diffInTime / (1000 * 3600 * 24);
      return diffInDays <= rangeInDays;
    });
  }, [selectedRange, data]);

  // Dummy mental health data for visualization
  const dummyMentalHealthData = useMemo(() => {
    const mentalData = [];
    const today = new Date();
    const days = selectedRange === '7d' ? 7 : selectedRange === '1m' ? 30 : 180;
    
    for (let i = 0; i < days; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      
      mentalData.push({
        date: dayName,
        stress: Math.floor(Math.random() * 10) + 1, // 1-10 scale
        anxiety: Math.floor(Math.random() * 10) + 1, // 1-10 scale
        meditation: Math.random() > 0.4 ? Math.floor(Math.random() * 45) + 15 : 0, // 15-60 min or 0
        sleep: parseFloat((Math.random() * (9 - 6) + 6).toFixed(1)), // 6-9 hours
        energy: Math.floor(Math.random() * 10) + 1, // 1-10 scale
      });
    }
    return mentalData.reverse();
  }, [selectedRange]);

  const chartData = filteredData.length > 0 ? filteredData : dummyMentalHealthData;

  const colors = {
    stress: '#FB923C',
    anxiety: '#F87171',
    meditation: '#4ADE80',
    sleep: '#A78BFA',
    energy: '#60A5FA',
  };

  return (
    <Card className="rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl bg-white/40 backdrop-blur-md border-none p-3 sm:p-4 lg:p-6 md:col-span-2 lg:col-span-3">
      <div className="flex items-center space-x-2 mb-3 sm:mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">Mental Health Trend 🧠</h3>
      </div>
      <CardContent className="p-0 h-48 sm:h-56 lg:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="date" 
              className="text-xs text-gray-500" 
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              className="text-xs text-gray-500" 
              tick={{ fontSize: 10 }}
              domain={[0, 'dataMax']}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Meditation time as bars */}
            <Bar 
              dataKey="meditation" 
              fill={colors.meditation} 
              radius={[6, 6, 0, 0]}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
      
      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-3 sm:mt-4">
        <div className="text-center">
          <p className="text-sm sm:text-lg font-bold text-gray-800">{Math.round(chartData.reduce((acc, d) => acc + d.meditation, 0) / chartData.filter(d => d.meditation > 0).length) || 0}</p>
          <p className="text-xs text-gray-500">Avg Minutes</p>
        </div>
        <div className="text-center">
          <p className="text-sm sm:text-lg font-bold text-gray-800">{chartData.filter(d => d.meditation > 0).length}</p>
          <p className="text-xs text-gray-500">Active Days</p>
        </div>
        <div className="text-center">
          <p className="text-sm sm:text-lg font-bold text-gray-800">{Math.round(chartData.reduce((acc, d) => acc + d.sleep, 0) / chartData.length * 10) / 10}</p>
          <p className="text-xs text-gray-500">Avg Sleep</p>
        </div>
        <div className="text-center">
          <p className="text-sm sm:text-lg font-bold text-gray-800">{Math.round(chartData.reduce((acc, d) => acc + d.energy, 0) / chartData.length)}</p>
          <p className="text-xs text-gray-500">Avg Energy</p>
        </div>
      </div>
    </Card>
  );
};

export default MentalHealthTrendChart;