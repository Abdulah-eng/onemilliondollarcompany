// src/pages/customer/ProgressPage.tsx
import { mockProgressData } from '@/mockdata/progress/mockProgressData';
import SectionHeader from '@/components/customer/progress/SectionHeader';

// --- NEW COMPONENT IMPORTS ---
import HeroProgressSnapshot from '@/components/customer/progress/HeroProgressSnapshot';
import DailyCheckinTrends from '@/components/customer/progress/DailyCheckinTrends';
import FitnessProgression from '@/components/customer/progress/FitnessProgression';
import NutritionProgression from '@/components/customer/progress/NutritionProgression';
import MentalHealthProgression from '@/components/customer/progress/MentalHealthProgression';
import WeightProgressCard from '@/components/customer/progress/WeightProgressCard';
import PhotoProgressCard from '@/components/customer/progress/PhotoProgressCard';
import SmartInsights from '@/components/customer/progress/SmartInsights';

export default function ProgressPage() {
  const data = mockProgressData;

  // Calculate averages for Hero card
  const last7DaysCheckins = data.dailyCheckins.slice(-7);
  const avgSleep = last7DaysCheckins.reduce((sum, day) => sum + day.sleepHours, 0) / last7DaysCheckins.length;
  const avgEnergy = last7DaysCheckins.reduce((sum, day) => sum + day.energyLevel, 0) / last7DaysCheckins.length;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* --- HEADER --- */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
        <p className="text-muted-foreground">A detailed overview of your wellness journey.</p>
      </div>

      {/* 1. Hero Progress Snapshot */}
      <HeroProgressSnapshot
        weightEntries={data.weightEntries}
        streak={data.workoutStreak}
        avgSleep={avgSleep}
        avgEnergy={avgEnergy}
      />

      {/* 7. Smart Insights */}
      <div className="space-y-4">
        <SectionHeader title="Smart Insights" />
        <SmartInsights insights={data.smartInsights} />
      </div>

      {/* 2. Daily Check-in Trends (Wellness Overview) */}
      <div className="space-y-4">
        <SectionHeader title="Daily Check-in Trends" />
        <DailyCheckinTrends checkins={data.dailyCheckins} />
      </div>
      
      {/* 3. Fitness Progression */}
      <div className="space-y-4">
        <SectionHeader title="Fitness Progression" />
        <FitnessProgression data={data.fitnessProgression} />
      </div>

      {/* 4. Nutrition Progression */}
      <div className="space-y-4">
        <SectionHeader title="Nutrition Progression" />
        <NutritionProgression data={data.nutrition} />
      </div>

      {/* 5. Mental Health Progression */}
      <div className="space-y-4">
        <SectionHeader title="Mental Health Progression" />
        <MentalHealthProgression mentalHealth={data.mentalHealth} dailyCheckins={data.dailyCheckins}/>
      </div>

      {/* 6. Weight & Body Composition */}
      <div className="space-y-4">
        <SectionHeader title="Weight & Body Composition" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeightProgressCard data={data.weightEntries} />
          <PhotoProgressCard photos={data.photoEntries} />
        </div>
      </div>
      
    </div>
  );
}
