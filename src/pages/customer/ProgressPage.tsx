// src/pages/customer/ProgressPage.tsx
import { Flame, Droplets, Bed, Smile, HeartPulse, BrainCircuit, Dumbbell } from 'lucide-react';
import { mockProgressData } from '@/mockdata/progress/mockProgressData';
import StatCard from '@/components/customer/progress/StatCard';
import WeightProgressCard from '@/components/customer/progress/WeightProgressCard';
import PhotoProgressCard from '@/components/customer/progress/PhotoProgressCard';
import MacroCard from '@/components/customer/progress/MacroCard';
import { Button } from '@/components/ui/button';

export default function ProgressPage() {
  const { 
    weightEntries, 
    photoEntries, 
    dailyCheckins, 
    workoutStreak, 
    totalCaloriesBurned,
    avgMeditationMinutes,
    nutrition,
    stressTrend
  } = mockProgressData;

  const avgSleep = dailyCheckins.reduce((acc, curr) => acc + curr.sleepHours, 0) / dailyCheckins.length;
  const avgWater = dailyCheckins.reduce((acc, curr) => acc + curr.waterLiters, 0) / dailyCheckins.length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* --- Header & Main Actions --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
          <p className="text-muted-foreground">An overview of your trends and achievements.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button className="w-full">Log Weight</Button>
          <Button variant="outline" className="w-full">Add Photo</Button>
        </div>
      </div>

      {/* --- Main Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column 1 */}
        <div className="space-y-6">
          <WeightProgressCard data={weightEntries} />
          <MacroCard data={nutrition.last7Days} />
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
            <PhotoProgressCard photos={photoEntries} />
            <div className="grid grid-cols-2 gap-4">
                <StatCard icon={<Flame className="h-5 w-5 text-white" />} title="Workout Streak" value={`${workoutStreak} days`} colorClass="bg-orange-500" />
                <StatCard icon={<Dumbbell className="h-5 w-5 text-white" />} title="Calories Burned" value={totalCaloriesBurned.toLocaleString()} colorClass="bg-red-500" />
                <StatCard icon={<Droplets className="h-5 w-5 text-white" />} title="Avg. Water" value={`${avgWater.toFixed(1)} L`} colorClass="bg-blue-500" />
                <StatCard icon={<Bed className="h-5 w-5 text-white" />} title="Avg. Sleep" value={`${avgSleep.toFixed(1)} h`} colorClass="bg-indigo-500" />
            </div>
        </div>

        {/* Column 3 */}
        <div className="space-y-6">
             <StatCard icon={<HeartPulse className="h-5 w-5 text-white" />} title="Stress Trend" value={stressTrend.charAt(0).toUpperCase() + stressTrend.slice(1)} trend={{direction: stressTrend === 'improving' ? 'down' : 'up', value: 'Last 7 days'}} colorClass="bg-rose-500" />
             <StatCard icon={<Smile className="h-5 w-5 text-white" />} title="Avg. Mood" value="Good" colorClass="bg-yellow-500" />
             <StatCard icon={<BrainCircuit className="h-5 w-5 text-white" />} title="Avg. Meditation" value={`${avgMeditationMinutes} min`} colorClass="bg-purple-500" />
        </div>
      </div>
    </div>
  );
}
