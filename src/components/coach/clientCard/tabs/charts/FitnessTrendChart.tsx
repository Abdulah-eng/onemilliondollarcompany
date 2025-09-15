import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface FitnessTrendChartProps {
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
            {`${p.name}: `} <span className="font-medium ml-1">{p.value}{p.name.includes('Weight') ? 'kg' : p.name.includes('Reps') ? '' : '%'}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const FitnessTrendChart: React.FC<FitnessTrendChartProps> = ({ data, selectedRange }) => {
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

  // Dummy fitness data for visualization
  const dummyFitnessData = useMemo(() => {
    const fitnessData = [];
    const today = new Date();
    const days = selectedRange === '7d' ? 7 : selectedRange === '1m' ? 30 : 180;
    
    for (let i = 0; i < days; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      
      // Simulate workout data
      const hasWorkout = Math.random() > 0.3; // 70% chance of workout
      fitnessData.push({
        date: dayName,
        adherence: hasWorkout ? (Math.random() > 0.2 ? 100 : Math.floor(Math.random() * 50) + 50) : 0, // 100% or partial/skipped
        benchPressReps: hasWorkout ? Math.floor(Math.random() * 5) + 8 : 0, // 8-12 reps
        benchPressWeight: hasWorkout ? Math.floor(Math.random() * 20) + 80 : 0, // 80-100kg
        squatReps: hasWorkout ? Math.floor(Math.random() * 5) + 8 : 0,
        squatWeight: hasWorkout ? Math.floor(Math.random() * 30) + 100 : 0, // 100-130kg
        workoutDuration: hasWorkout ? Math.floor(Math.random() * 30) + 45 : 0, // 45-75 min
        progression: hasWorkout && Math.random() > 0.7 ? Math.floor(Math.random() * 10) + 1 : 0, // Occasional progression
      });
    }
    return fitnessData.reverse();
  }, [selectedRange]);

  const chartData = filteredData.length > 0 ? filteredData : dummyFitnessData;

  const colors = {
    adherence: '#60A5FA',
    benchPress: '#34D399',
    squat: '#F87171',
    progression: '#FBBF24',
  };

  return (
    <Card className="rounded-3xl shadow-xl bg-white/40 backdrop-blur-md border-none p-6 md:col-span-2 lg:col-span-3">
      <div className="flex items-center space-x-2 mb-4">
        <h3 className="text-xl font-bold text-gray-800">Fitness Trend 💪</h3>
      </div>
      <CardContent className="p-0 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="date" className="text-xs text-gray-500" />
            <YAxis yAxisId="left" className="text-xs text-gray-500" />
            <YAxis yAxisId="right" orientation="right" className="text-xs text-gray-500" />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
            
            {/* Adherence as area/bar */}
            <Bar yAxisId="left" dataKey="adherence" fill={colors.adherence} name="Adherence %" radius={[4, 4, 0, 0]} />
            
            {/* Exercise progression as lines */}
            <Line yAxisId="right" type="monotone" dataKey="benchPressWeight" stroke={colors.benchPress} strokeWidth={2} name="Bench Press Weight" dot={{ r: 3 }} />
            <Line yAxisId="right" type="monotone" dataKey="squatWeight" stroke={colors.squat} strokeWidth={2} name="Squat Weight" dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
      
      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">{Math.round(chartData.reduce((acc, d) => acc + d.adherence, 0) / chartData.length)}%</p>
          <p className="text-xs text-gray-500">Avg Adherence</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">{chartData.filter(d => d.adherence === 100).length}</p>
          <p className="text-xs text-gray-500">Perfect Days</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">{chartData.filter(d => d.adherence === 0).length}</p>
          <p className="text-xs text-gray-500">Skipped Days</p>
        </div>
      </div>
    </Card>
  );
};

export default FitnessTrendChart;