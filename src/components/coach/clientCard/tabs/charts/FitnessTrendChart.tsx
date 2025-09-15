import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface FitnessTrendChartProps {
  data: any[];
  selectedRange: string;
}

const EnhancedFitnessTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    if (!data) return null;

    return (
      <div className="bg-white/90 p-4 rounded-xl shadow-xl backdrop-blur-md border border-gray-200/50 text-gray-800 max-w-xs">
        <p className="font-bold text-sm mb-3 text-gray-900 border-b border-gray-200 pb-2">{label}</p>
        
        {/* Adherence Status */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Workout Status:</span>
            <span className={`text-xs font-bold ${data.adherence === 100 ? 'text-green-600' : data.adherence > 0 ? 'text-amber-600' : 'text-red-600'}`}>
              {data.adherence === 100 ? '✅ Completed' : data.adherence > 0 ? '⚠️ Partial' : '❌ Skipped'}
            </span>
          </div>
          <div className="text-xs text-gray-500">Adherence: {data.adherence}%</div>
        </div>

        {/* Exercise Improvements */}
        {data.adherence > 0 && (
          <div className="space-y-2">
            {data.benchPressWeight > 0 && (
              <div className="bg-green-50 p-2 rounded-lg">
                <div className="text-xs font-semibold text-green-800">💪 Bench Press</div>
                <div className="text-xs text-green-700">
                  {data.benchPressReps} reps × {data.benchPressWeight}kg
                  {data.progression > 0 && (
                    <span className="ml-2 text-green-600 font-bold">
                      +{data.progression}% improvement!
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {data.squatWeight > 0 && (
              <div className="bg-blue-50 p-2 rounded-lg">
                <div className="text-xs font-semibold text-blue-800">🏋️ Squat</div>
                <div className="text-xs text-blue-700">
                  {data.squatReps} reps × {data.squatWeight}kg
                  {data.progression > 0 && (
                    <span className="ml-2 text-blue-600 font-bold">
                      Max reps achieved!
                    </span>
                  )}
                </div>
              </div>
            )}

            {data.workoutDuration > 0 && (
              <div className="bg-purple-50 p-2 rounded-lg">
                <div className="text-xs font-semibold text-purple-800">⏱️ Duration</div>
                <div className="text-xs text-purple-700">{data.workoutDuration} minutes</div>
              </div>
            )}
          </div>
        )}

        {/* Motivational Message */}
        {data.adherence === 0 && (
          <div className="mt-2 p-2 bg-red-50 rounded-lg">
            <div className="text-xs text-red-700">Rest day or missed workout</div>
          </div>
        )}
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
      
      // Simulate workout data with realistic progression
      const hasWorkout = Math.random() > 0.3; // 70% chance of workout
      const isFullWorkout = hasWorkout && Math.random() > 0.2; // 80% of workouts are complete
      
      const benchPress = hasWorkout ? {
        reps: Math.floor(Math.random() * 4) + 8, // 8-11 reps
        weight: Math.floor(Math.random() * 15) + 80 + (i % 10 === 0 ? 5 : 0), // Progressive overload every 10 days
        improvement: i % 7 === 0 && hasWorkout ? Math.floor(Math.random() * 15) + 5 : 0 // Weekly improvements
      } : { reps: 0, weight: 0, improvement: 0 };

      const squat = hasWorkout ? {
        reps: Math.floor(Math.random() * 4) + 8, // 8-11 reps  
        weight: Math.floor(Math.random() * 20) + 100 + (i % 14 === 0 ? 10 : 0), // Progressive overload every 2 weeks
        improvement: i % 5 === 0 && hasWorkout ? Math.floor(Math.random() * 12) + 3 : 0 // Bi-weekly improvements
      } : { reps: 0, weight: 0, improvement: 0 };

      fitnessData.push({
        date: dayName,
        adherence: hasWorkout ? (isFullWorkout ? 100 : Math.floor(Math.random() * 40) + 50) : 0,
        benchPressReps: benchPress.reps,
        benchPressWeight: benchPress.weight,
        squatReps: squat.reps,
        squatWeight: squat.weight,
        workoutDuration: hasWorkout ? Math.floor(Math.random() * 25) + 45 : 0, // 45-70 min
        progression: Math.max(benchPress.improvement, squat.improvement),
        // Additional achievement flags
        newPR: i % 21 === 0 && hasWorkout, // Personal record every 3 weeks
        perfectForm: hasWorkout && Math.random() > 0.7, // Good form 30% of time
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
            <Tooltip content={<EnhancedFitnessTooltip />} />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
            
            {/* Adherence as interactive bars with hover effects */}
            <Bar 
              yAxisId="left" 
              dataKey="adherence" 
              fill={colors.adherence} 
              name="Adherence %" 
              radius={[6, 6, 0, 0]}
              cursor="pointer"
            />
            
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