'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Play, Clock, Pencil, ClipboardCheck, LayoutGrid, Tag } from 'lucide-react';
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
  const statusOptions = [
    { value: 'all', label: 'All', icon: <LayoutGrid className="h-4 w-4" /> },
    { value: 'active', label: 'Active', icon: <Play className="h-4 w-4" /> },
    { value: 'scheduled', label: 'Scheduled', icon: <Clock className="h-4 w-4" /> },
    { value: 'draft', label: 'Draft', icon: <Pencil className="h-4 w-4" /> },
    { value: 'normal', label: 'Normal', icon: <ClipboardCheck className="h-4 w-4" /> },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'mental health', label: 'Mental Health' },
  ];

  return (
    <motion.div
      className="flex flex-col gap-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search programs..."
          className="w-full pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Status Filters */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2 hidden md:block">Filter by Status</h3>
        <div className="flex flex-row overflow-x-auto gap-2 py-1 scrollbar-hide md:flex-wrap">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={activeStatus === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveStatus(option.value as ProgramStatus | 'all')}
              className="flex items-center gap-2 rounded-full px-4 shrink-0"
            >
              {option.icon && React.cloneElement(option.icon, { className: 'h-4 w-4' })}
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2 hidden md:block">Filter by Category</h3>
        <div className="flex flex-row overflow-x-auto gap-2 py-1 scrollbar-hide md:flex-wrap">
          {categoryOptions.map((option) => (
            <Button
              key={option.value}
              variant={activeCategory === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(option.value as ProgramCategory | 'all')}
              className="flex items-center gap-2 rounded-full px-4 shrink-0"
            >
              <Tag className="h-4 w-4" />
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProgramsFilters;
