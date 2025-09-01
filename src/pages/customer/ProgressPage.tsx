// src/pages/customer/ProgressPage.tsx
import { mockProgressData } from '@/mockdata/progress/mockProgressData';
import { Button } from '@/components/ui/button';
import QuickStats from '@/components/customer/progress/QuickStats';
import SectionHeader from '@/components/customer/progress/SectionHeader';
import GoalCard from '@/components/customer/progress/GoalCard';
import DailyCheckinCard from '@/components/customer/progress/DailyCheckinCard';
import FitnessTrendCard from '@/components/customer/progress/FitnessTrendCard';
import WeightProgressCard from '@/components/customer/progress/WeightProgressCard';
import PhotoProgressCard from '@/components/customer/progress/PhotoProgressCard';
import MacroCard from '@/components/customer/progress/MacroCard';

export default function ProgressPage() {
  const data = mockProgressData;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
          <p className="text-muted-foreground">An overview of your trends and achievements.</p>
        </div>
      </div>

      {/* --- QUICK STATS & MAIN TRENDS --- */}
      <QuickStats data={data.mainStats} />

      {/* --- GOALS --- */}
      <div className="space-y-4">
        <SectionHeader title="Your Goals" actionText="Manage Goals" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.goals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
        </div>
      </div>
      
      {/* --- DAILY CHECK-INS --- */}
      <div className="space-y-4">
        <SectionHeader title="Daily Check-ins" actionText="View All" />
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.dailyCheckins.slice(-4).map(checkin => <DailyCheckinCard key={checkin.date} checkin={checkin} />)}
        </div>
      </div>

      {/* --- PROGRAM TRENDS --- */}
      <div className="space-y-4">
        <SectionHeader title="Program Trends" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MacroCard data={data.nutrition} />
            <div className="grid grid-cols-2 gap-4">
                 {data.fitnessTrends.map(trend => <FitnessTrendCard key={trend.id} trend={trend} />)}
            </div>
            {/* You can add a mental health summary card here */}
             <div className="bg-card dark:bg-[#0d1218] p-4 rounded-2xl border border-border/50">
                <p className="font-semibold">Mental Wellness</p>
                <p className="text-2xl font-bold">{data.avgMeditationMinutes} min</p>
                <p className="text-sm text-muted-foreground">Avg. Meditation</p>
            </div>
        </div>
      </div>

      {/* --- OTHER TRENDS (WEIGHT & PHOTOS) --- */}
      <div className="space-y-4">
        <SectionHeader title="Body Composition" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WeightProgressCard data={data.weightEntries} />
            <PhotoProgressCard photos={data.photoEntries} />
        </div>
      </div>

       {/* --- ACTION BUTTONS (Optional Footer) --- */}
       <div className="flex gap-2 w-full pt-4">
          <Button size="lg" className="w-full">Log Today's Weight</Button>
          <Button size="lg" variant="outline" className="w-full">Add New Photo</Button>
        </div>
    </div>
  );
}
