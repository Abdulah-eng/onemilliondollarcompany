// src/pages/coach/ProgramBuilder.tsx
'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProgramDetails from '@/components/coach/createprogram/ProgramDetails';
import FitnessBuilder from '@/components/coach/createprogram/builders/FitnessBuilder';
import { Separator } from '@/components/ui/separator';
import { Crown } from 'lucide-react';

type Step = 'program-details' | 'fitness-builder' | 'nutrition-builder' | 'mental-health-builder';

interface ProgramData {
  category: string;
  title: string;
  description: string;
  plan: any;
}

const ProgramBuilder = () => {
  const [step, setStep] = useState<Step>('program-details');
  const [programData, setProgramData] = useState<Partial<ProgramData>>({});

  const handleProgramDetailsNext = (data: any) => {
    setProgramData(prev => ({ ...prev, ...data }));
    if (data.category === 'fitness') {
      setStep('fitness-builder');
    } else {
      console.log('Builder for this category is not yet implemented.');
    }
  };

  const handleSaveProgram = (planData: any) => {
    const finalProgram = {
      ...programData,
      plan: planData,
    };
    console.log('Final Program Data:', finalProgram);
    alert('Program saved!');
  };

  const renderStep = () => {
    switch (step) {
      case 'program-details':
        return <ProgramDetails onNext={handleProgramDetailsNext} initialData={programData} />;
      case 'fitness-builder':
        return (
          <FitnessBuilder
            onBack={() => setStep('program-details')}
            onSave={handleSaveProgram}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Create New Program</h1>
        <div className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-yellow-500" />
          <span className="text-lg font-semibold">Premium Feature</span>
        </div>
      </div>
      <Separator className="mb-8" />
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProgramBuilder;
