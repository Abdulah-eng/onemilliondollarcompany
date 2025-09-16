// src/components/coach/programs/ProgramsFilters.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Search, Play, Clock, Pencil, PlusCircle, ClipboardCheck } from 'lucide-react';
import { ProgramCategory, ProgramStatus } from '@/mockdata/programs/mockCoachPrograms';

interface ProgramsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeStatus: ProgramStatus | 'all';
  setActiveStatus: (status: ProgramStatus | 'all') => void;
  activeCategory: ProgramCategory | 'all';
  setActiveCategory: (category: ProgramCategory | 'all') => void;
}

const ProgramsFilters: React.FC<ProgramsFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  activeStatus,
  setActiveStatus,
  activeCategory,
  setActiveCategory,
}) => {
  return (
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
  );
};

export default ProgramsFilters;
