'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, ChevronDown, Filter, Play, Clock, Pencil, ClipboardCheck, Tag, LayoutGrid, PlusCircle } from 'lucide-react';
import { ProgramCategory, ProgramStatus } from '@/mockdata/programs/mockCoachPrograms';
import { cn } from '@/lib/utils';

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
    { value: 'all', label: 'All', icon: LayoutGrid },
    { value: 'active', label: 'Active', icon: Play },
    { value: 'scheduled', label: 'Scheduled', icon: Clock },
    { value: 'draft', label: 'Draft', icon: Pencil },
    { value: 'normal', label: 'Normal', icon: PlusCircle },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'mental health', label: 'Mental Health' },
  ];

  const getStatusLabel = (value: string) => {
    return statusOptions.find(opt => opt.value === value)?.label || 'Status';
  };

  const getCategoryLabel = (value: string) => {
    return categoryOptions.find(opt => opt.value === value)?.label || 'Category';
  };

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search programs by name or description..."
          className="w-full pl-12 pr-4 py-3 text-base rounded-xl border-2 focus:border-primary/50 bg-background/50 backdrop-blur-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant={activeCategory === 'all' ? "default" : "outline"}
          onClick={() => setActiveCategory('all')}
          className="rounded-full px-6 py-2 text-sm font-medium transition-all hover:scale-105"
        >
          All Categories
        </Button>
        {categoryOptions.slice(1).map(option => (
          <Button
            key={option.value}
            variant={activeCategory === option.value ? "default" : "outline"}
            onClick={() => setActiveCategory(option.value as typeof activeCategory)}
            className="rounded-full px-6 py-2 text-sm font-medium transition-all hover:scale-105"
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-3">
        {statusOptions.map(option => (
          <Button
            key={option.value}
            variant={activeStatus === option.value ? "default" : "outline"}
            onClick={() => setActiveStatus(option.value as typeof activeStatus)}
            className="rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105 flex items-center gap-2"
          >
            <option.icon className="h-4 w-4" />
            {option.label}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export default ProgramsFilters;
