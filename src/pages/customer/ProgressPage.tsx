// src/pages/customer/ProgressPage.tsx
import { useState } from 'react';
import { mockProgressData } from '@/mockdata/progress/mockProgressData';

// --- NEW & UPDATED COMPONENT IMPORTS ---
import HeroProgressSnapshot from '@/components/customer/progress/HeroProgressSnapshot';
import DailyCheckinTrends from '@/components/customer/progress/DailyCheckinTrends';
import FitnessProgression from '@/components/customer/progress/fitness/FitnessProgression';
import MentalHealthProgression from '@/components/customer/progress/mental/MentalHealthProgression';
import PhotoProgressCard from '@/components/customer/progress/PhotoProgressCard';
import SmartInsights from '@/components/customer/progress/SmartInsights';
import FloatingActionButton from '@/components/customer/progress/FloatingActionButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Corrected import path for the NutritionProgression component
import NutritionProgression from '@/components/customer/progress/nutrition/NutritionProgression';

export default function ProgressPage() {
  const data = mockProgressData;

  // State for the detail modal
  const [modalData, setModalData] = useState<{ title: string; content: React.ReactNode } | null>(null);

  // --- EXAMPLE MODAL HANDLER ---
  const handleCardClick = (title: string, content: React.ReactNode) => {
    setModalData({ title, content });
  };

  // Defensive programming: ensure data exists
  if (!data || !data.dailyCheckins || !data.nutrition?.macros) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Loading Progress...</h1>
          <p className="text-muted-foreground">Please wait while we load your data.</p>
        </div>
      </div>
    );
  }

  // Calculate averages for Hero card
  const last7DaysCheckins = data.dailyCheckins.slice(-7);
  const avgSleep = last7DaysCheckins.length > 0 
    ? last7DaysCheckins.reduce((sum, day) => sum + day.sleepHours, 0) / last7DaysCheckins.length 
    : 0;
  const avgEnergy = last7DaysCheckins.length > 0
    ? last7DaysCheckins.reduce((sum, day) => sum + day.energyLevel, 0) / last7DaysCheckins.length
    : 0;
  
  // --- NEW: Calculate averages for goal progression ---
  const last7DaysMacros = data.nutrition?.macros?.slice(-7) || [];
  const avgProtein = last7DaysMacros.length > 0
    ? last7DaysMacros.reduce((sum, day) => sum + day.protein, 0) / last7DaysMacros.length
    : 0;
  const avgCarbs = last7DaysMacros.length > 0
    ? last7DaysMacros.reduce((sum, day) => sum + day.carbs, 0) / last7DaysMacros.length
    : 0;

  return (
    <div className="relative w-full min-h-screen">
      <div className="w-full max-w-4xl mx-auto px-4 py-8 pb-28 space-y-10">
        {/* --- HEADER --- */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
          <p className="text-muted-foreground">A detailed overview of your wellness journey.</p>
        </div>

        {/* 1. Hero Progress Snapshot --- UPDATED PROPS --- */}
        <HeroProgressSnapshot
          streak={data.workoutStreak}
          avgSleep={avgSleep}
          avgEnergy={avgEnergy}
          kcalBurned={data.kcalBurnedLast7Days}
          goals={data.userGoals}
          dailyCheckins={data.dailyCheckins}
          nutrition={data.nutrition}
          avgProtein={avgProtein}
          avgCarbs={avgCarbs}
        />

        {/* 2. Smart Insights */}
        <SmartInsights insights={data.smartInsights} />

        {/* 3. Daily Check-in Trends (Wellness Overview) */}
        <DailyCheckinTrends checkins={data.dailyCheckins} onCardClick={handleCardClick} />
        
        {/* 4. Fitness Progression */}
        <FitnessProgression data={data.fitnessProgression} />

        {/* 5. Nutrition Progression */}
        <NutritionProgression data={data.nutrition} />

        {/* 6. Mental Health Progression */}
        <MentalHealthProgression mentalHealth={data.mentalHealth} dailyCheckins={data.dailyCheckins}/>

        {/* 7. Photo Progress Card (Weight card removed) */}
        <div className="grid grid-cols-1 gap-6">
          <PhotoProgressCard photos={data.photoEntries} />
        </div>
      </div>
      
      {/* --- FLOATING ACTION BUTTON --- */}
      <FloatingActionButton />

      {/* --- GENERIC DETAIL MODAL --- */}
      <Dialog open={!!modalData} onOpenChange={() => setModalData(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{modalData?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {modalData?.content}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
