// src/pages/coach/ProgramBuilder.tsx
'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProgramDetails from '@/components/coach/createprogram/ProgramDetails';
import FitnessBuilder from '@/components/coach/createprogram/builders/FitnessBuilder';
import NutritionBuilder from '@/components/coach/createprogram/nutrition/NutritionBuilder'; 
import MentalHealthBuilder from '@/components/coach/createprogram/mentalhealth/MentalHealthBuilder'; // ⭐ ADD THIS IMPORT
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';

type Step = 'program-details' | 'fitness-builder' | 'nutrition-builder' | 'mental-health-builder';

interface ProgramData {
  category: 'fitness' | 'nutrition' | 'mental health';
  title: string;
  description: string;
  plan: any;
}

const ProgramBuilder = () => {
  const [step, setStep] = useState<Step>('program-details');
  const [programData, setProgramData] = useState<Partial<ProgramData>>({});

  const handleProgramDetailsNext = (data: any) => {
    setProgramData(prev => ({ ...prev, ...data }));
    
    // ⭐ UPDATE THE NAVIGATION LOGIC
    if (data.category === 'fitness') {
      setStep('fitness-builder');
    } else if (data.category === 'nutrition') {
      setStep('nutrition-builder');
    } else if (data.category === 'mental health') {
      setStep('mental-health-builder'); // Navigate to the new mental health builder
    } else {
      console.log(`Builder for ${data.category} is not yet implemented.`);
      alert(`Builder for ${data.category} is not yet implemented. Please select Fitness, Nutrition, or Mental Health.`);
    }
  };

  const handleSaveProgram = (planData: any) => {
    const finalProgram = {
      ...programData,
      plan: planData,
    };
    console.log('Final Program Data:', finalProgram);
    alert('Program saved!');
    setStep('program-details');
    setProgramData({});
  };

  const renderStep = () => {
    const commonBuilderProps = {
      onBack: () => setStep('program-details'),
      onSave: handleSaveProgram,
    };

    switch (step) {
      case 'program-details':
        return (
          <ProgramDetails onNext={handleProgramDetailsNext} initialData={programData} />
        );
      case 'fitness-builder':
        return (
          <FitnessBuilder {...commonBuilderProps} />
        );
      case 'nutrition-builder': 
        return (
          <NutritionBuilder {...commonBuilderProps} />
        );
      case 'mental-health-builder': // ⭐ ADD THE NEW CASE
        return (
          <MentalHealthBuilder {...commonBuilderProps} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      {step === 'program-details' && (
        <>
          <h1 className="text-4xl font-bold">Create New Program</h1>
          <Separator className="my-8" />
        </>
      )}
      
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProgramBuilder;
