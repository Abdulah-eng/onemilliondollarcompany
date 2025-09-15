import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';

interface MentalHealthTrendChartProps {
  data: any[];
  selectedRange: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/70 p-2 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200/50 text-gray-800">
        <p className="font-semibold text-xs mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="text-xs flex items-center" style={{ color: p.color }}>
            <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: p.color }}></span>
            {`${p.name}: `} <span className="font-medium ml-1">{p.value}{p.name.includes('Meditation') ? 'min' : p.name.includes('Sleep') ? 'hrs' : ''}</span>
          </p>
        ))}
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
    <Card className="rounded-3xl shadow-xl bg-white/40 backdrop-blur-md border-none p-6 md:col-span-2 lg:col-span-3">
      <div className="flex items-center space-x-2 mb-4">
        <h3 className="text-xl font-bold text-gray-800">Mental Health Trend 🧠</h3>
      </div>
      <CardContent className="p-0 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="date" className="text-xs text-gray-500" />
            <YAxis yAxisId="left" className="text-xs text-gray-500" domain={[0, 10]} />
            <YAxis yAxisId="right" orientation="right" className="text-xs text-gray-500" />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
            
            {/* Meditation time as bars */}
            <Bar yAxisId="right" dataKey="meditation" fill={colors.meditation} name="Meditation (min)" radius={[4, 4, 0, 0]} />
            
            {/* Stress and anxiety as lines */}
            <Line yAxisId="left" type="monotone" dataKey="stress" stroke={colors.stress} strokeWidth={2} name="Stress Level" dot={{ r: 3 }} />
            <Line yAxisId="left" type="monotone" dataKey="anxiety" stroke={colors.anxiety} strokeWidth={2} name="Anxiety Level" dot={{ r: 3 }} />
            <Line yAxisId="left" type="monotone" dataKey="energy" stroke={colors.energy} strokeWidth={2} name="Energy Level" dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
      
      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">{Math.round(chartData.reduce((acc, d) => acc + d.stress, 0) / chartData.length)}</p>
          <p className="text-xs text-gray-500">Avg Stress</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">{Math.round(chartData.reduce((acc, d) => acc + d.anxiety, 0) / chartData.length)}</p>
          <p className="text-xs text-gray-500">Avg Anxiety</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">{Math.round(chartData.reduce((acc, d) => acc + d.meditation, 0) / chartData.filter(d => d.meditation > 0).length) || 0}</p>
          <p className="text-xs text-gray-500">Avg Meditation</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">{chartData.filter(d => d.meditation > 0).length}</p>
          <p className="text-xs text-gray-500">Meditation Days</p>
        </div>
      </div>
    </Card>
  );
};

export default MentalHealthTrendChart;