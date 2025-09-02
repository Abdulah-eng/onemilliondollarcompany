// src/pages/customer/ProgressPage.tsx
import { useState } from 'react';
import { mockProgressData } from '@/mockdata/progress/mockProgressData';

// --- NEW & UPDATED COMPONENT IMPORTS ---
import HeroProgressSnapshot from '@/components/customer/progress/HeroProgressSnapshot';
import DailyCheckinTrends from '@/components/customer/progress/DailyCheckinTrends';
import FitnessProgression from '@/components/customer/progress/FitnessProgression';
import NutritionProgression from '@/components/customer/progress/NutritionProgression';
import MentalHealthProgression from '@/components/customer/progress/MentalHealthProgression';
import WeightProgressCard from '@/components/customer/progress/WeightProgressCard';
import PhotoProgressCard from '@/components/customer/progress/PhotoProgressCard';
import SmartInsights from '@/components/customer/progress/SmartInsights';
import FloatingActionButton from '@/components/customer/progress/FloatingActionButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function ProgressPage() {
  const data = mockProgressData;

  // State for the detail modal
  const [modalData, setModalData] = useState<{ title: string; content: React.ReactNode } | null>(null);

  // --- EXAMPLE MODAL HANDLER ---
  // This function would be passed to child components to open the modal
  const handleCardClick = (title: string, content: React.ReactNode) => {
    setModalData({ title, content });
  };

  // Calculate averages for Hero card
  const last7DaysCheckins = data.dailyCheckins.slice(-7);
  const avgSleep = last7DaysCheckins.reduce((sum, day) => sum + day.sleepHours, 0) / last7DaysCheckins.length;
  const avgEnergy = last7DaysCheckins.reduce((sum, day) => sum + day.energyLevel, 0) / last7DaysCheckins.length;

  return (
    // Added 'relative' and 'min-h-screen' for FAB positioning
    <div className="relative w-full min-h-screen">
      <div className="w-full max-w-4xl mx-auto px-4 py-8 pb-28 space-y-10">
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

        {/* 2. Smart Insights */}
        <SmartInsights insights={data.smartInsights} />

        {/* 3. Daily Check-in Trends (Wellness Overview) - UPDATED */}
        <DailyCheckinTrends checkins={data.dailyCheckins} onCardClick={handleCardClick} />
        
        {/* 4. Fitness Progression */}
        <FitnessProgression data={data.fitnessProgression} />

        {/* 5. Nutrition Progression - UPDATED */}
        <NutritionProgression data={data.nutrition} />

        {/* 6. Mental Health Progression */}
        <MentalHealthProgression mentalHealth={data.mentalHealth} dailyCheckins={data.dailyCheckins}/>

        {/* 7. Weight & Body Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeightProgressCard data={data.weightEntries} onCardClick={() => handleCardClick("Weight Details", <p>Detailed weight view coming soon!</p>)} />
          <PhotoProgressCard photos={data.photoEntries} />
        </div>
      </div>
      
      {/* --- NEW FLOATING ACTION BUTTON --- */}
      <FloatingActionButton />

      {/* --- NEW GENERIC DETAIL MODAL --- */}
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
