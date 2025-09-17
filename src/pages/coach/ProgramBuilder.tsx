'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ProgramsFilters from '@/components/coach/programs/ProgramsFilters';
import ProgramDetails from '@/components/coach/createprogram/ProgramDetails';
import FitnessBuilder from '@/components/coach/createprogram/builders/FitnessBuilder';
import { Separator } from '@/components/ui/separator';

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
    if (data.category === 'fitness') {
      setStep('fitness-builder');
    } else {
      // Other builders can be added here in the future
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
    // You can redirect to the programs list or show a success message here
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Create New Program</h1>
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
