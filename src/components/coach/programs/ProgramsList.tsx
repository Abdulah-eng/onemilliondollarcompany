// src/components/coach/programs/ProgramsList.tsx
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ProgramCard } from '@/components/coach/programs/ProgramCard';
import ProgramsFilters from '@/components/coach/programs/ProgramsFilters';
import { mockCoachPrograms } from '@/mockdata/programs/mockCoachPrograms';
import { Program, ProgramCategory, ProgramStatus } from '@/mockdata/programs/mockCoachPrograms';
import { Frown } from 'lucide-react';

const ProgramsList = () => {
  const [activeStatus, setActiveStatus] = useState<ProgramStatus | 'all'>('all');
  const [activeCategory, setActiveCategory] = useState<ProgramCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrograms = useMemo(() => {
    return mockCoachPrograms.filter(program => {
      const matchesStatus = activeStatus === 'all' || program.status === activeStatus;
      const matchesCategory = activeCategory === 'all' || program.category === activeCategory;
      const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           program.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [activeStatus, activeCategory, searchQuery]);

  const handleEditProgram = useCallback((program: Program) => {
    console.log('Editing program:', program.name);
  }, []);

  const handleAssignProgram = useCallback((program: Program) => {
    console.log('Assigning program:', program.name);
  }, []);

  return (
    <>
      <ProgramsFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeStatus={activeStatus}
        setActiveStatus={setActiveStatus}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <motion.div
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {filteredPrograms.length > 0 ? (
          filteredPrograms.map(program => (
            <ProgramCard
              key={program.id}
              program={program}
              onEdit={handleEditProgram}
              onAssign={handleAssignProgram}
            />
          ))
        ) : (
          <Card className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <Frown className="h-12 w-12 mb-4" />
            <h3 className="font-semibold text-xl">No programs found</h3>
            <p>Try adjusting your search or filters.</p>
          </Card>
        )}
      </motion.div>
    </>
  );
};

export default ProgramsList;
