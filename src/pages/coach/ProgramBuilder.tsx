// src/pages/coach/ProgramBuilder.tsx
'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProgramDetails from '@/components/coach/createprogram/ProgramDetails';
import FitnessBuilder from '@/components/coach/createprogram/builders/FitnessBuilder';
// ⭐ 1. Import the new NutritionBuilder
import NutritionBuilder from '@/components/coach/createprogram/nutrition/NutritionBuilder'; 
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
    
    // ⭐ 2. Update logic to check for 'nutrition'
    if (data.category === 'fitness') {
      setStep('fitness-builder');
    } else if (data.category === 'nutrition') {
      setStep('nutrition-builder'); // Navigate to the new nutrition builder
    } else {
      // Handle 'mental health' or other categories
      console.log(`Builder for ${data.category} is not yet implemented.`);
      alert(`Builder for ${data.category} is not yet implemented. Please select Fitness or Nutrition.`);
    }
  };

  const handleSaveProgram = (planData: any) => {
    const finalProgram = {
      ...programData,
      plan: planData,
    };
    console.log('Final Program Data:', finalProgram);
    alert('Program saved!');
    // Optionally reset to the details page after saving
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
        // ⭐ 3. Add the new case for the Nutrition Builder
        return (
          <NutritionBuilder {...commonBuilderProps} />
        );
      default:
        // Placeholder for mental-health-builder or default unhandled state
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
        {/* Use motion.div with a key inside AnimatePresence for smooth transitions between steps */}
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
