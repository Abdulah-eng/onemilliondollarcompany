// src/pages/coach/programs.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgramCard } from '@/components/coach/programs/ProgramCard';
import { mockPrograms } from '@/mockdata/programs/mockPrograms';
import { Program, ProgramCategory, ProgramStatus } from '@/types/program';
import { Frown, PlusCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Helper function to get the correct icon for each tab
const getTabIcon = (status: ProgramStatus | 'all') => {
  switch (status) {
    case 'active':
      return <Play className="h-4 w-4" />;
    case 'scheduled':
      return <Clock className="h-4 w-4" />;
    case 'draft':
      return <Pencil className="h-4 w-4" />;
    case 'normal':
      return <PlusCircle className="h-4 w-4" />;
    default:
      return <ClipboardCheck className="h-4 w-4" />;
  }
};

const ProgramsPage = () => {
  const [activeStatus, setActiveStatus] = useState<ProgramStatus | 'all'>('all');
  const [activeCategory, setActiveCategory] = useState<ProgramCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrograms = useMemo(() => {
    return mockPrograms.filter(program => {
      const matchesStatus = activeStatus === 'all' || program.status === activeStatus;
      const matchesCategory = activeCategory === 'all' || program.category === activeCategory;
      const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           program.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [activeStatus, activeCategory, searchQuery]);

  const handleEditProgram = (program: Program) => {
    // Logic for editing a program
    console.log('Editing program:', program.name);
  };

  const handleAssignProgram = (program: Program) => {
    // Logic for assigning a program
    console.log('Assigning program:', program.name);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <motion.div
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Programs</h1>
        <p className="text-muted-foreground max-w-lg">
          Manage all your created programs. Assign, schedule, and edit them with ease.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="flex flex-col md:flex-row items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Search Input */}
        <div className="relative w-full md:w-auto md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search programs..."
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Tabs */}
        <Tabs value={activeStatus} onValueChange={(value) => setActiveStatus(value as ProgramStatus | 'all')}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full md:w-auto">
            <TabsTrigger value="all" className="flex items-center gap-2">All</TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">Active</TabsTrigger>
            <TabsTrigger value="scheduled" className="flex items-center gap-2">Scheduled</TabsTrigger>
            <TabsTrigger value="draft" className="flex items-center gap-2">Draft</TabsTrigger>
            <TabsTrigger value="normal" className="flex items-center gap-2">Normal</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-center md:justify-end">
          <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveCategory('all')}
            className="w-full md:w-auto"
          >
            All Categories
          </Button>
          <Button
            variant={activeCategory === 'fitness' ? 'default' : 'outline'}
            onClick={() => setActiveCategory('fitness')}
            className="w-full md:w-auto"
          >
            Fitness
          </Button>
          <Button
            variant={activeCategory === 'nutrition' ? 'default' : 'outline'}
            onClick={() => setActiveCategory('nutrition')}
            className="w-full md:w-auto"
          >
            Nutrition
          </Button>
          <Button
            variant={activeCategory === 'mental health' ? 'default' : 'outline'}
            onClick={() => setActiveCategory('mental health')}
            className="w-full md:w-auto"
          >
            Mental Health
          </Button>
        </div>
      </motion.div>

      {/* Programs Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
          <Card className="col-span-full flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <Frown className="h-12 w-12 mb-4" />
            <h3 className="font-semibold text-xl">No programs found</h3>
            <p>Try adjusting your search or filters.</p>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default ProgramsPage;
