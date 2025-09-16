// src/pages/coach/ProgramsPage.tsx
'use client';

import React from 'react';
import ProgramsHeader from '@/components/coach/programs/ProgramsHeader';
import ProgramsList from '@/components/coach/programs/ProgramsList';
import ProgramsFilters from '@/components/coach/programs/ProgramsFilters';

const ProgramsPage = () => {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <ProgramsHeader />
      <ProgramsFilters />
      <ProgramsList />
    </div>
  );
};

export default ProgramsPage;
