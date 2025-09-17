'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, ChevronDown, Filter, Play, Clock, Pencil, Tag, LayoutGrid, XCircle, PlusCircle } from 'lucide-react';
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

  const resetFilters = () => {
    setSearchQuery('');
    setActiveStatus('all');
    setActiveCategory('all');
  };

  const isFiltered = searchQuery || activeStatus !== 'all' || activeCategory !== 'all';

  return (
    <motion.div
      className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl border-2 shadow-sm bg-background/50 backdrop-blur-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Modern Search Bar */}
      <div className="relative flex-grow w-full md:w-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search programs..."
          className="w-full pl-12 pr-4 py-3 text-base rounded-full border-2 focus:border-primary/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Unified Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 rounded-full px-6 py-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            <ChevronDown className="h-4 w-4 ml-2 transition-transform duration-200" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {statusOptions.map(option => (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => setActiveStatus(option.value as typeof activeStatus)}
              className={cn("flex items-center gap-2", activeStatus === option.value && "bg-accent text-accent-foreground")}
            >
              <option.icon className="h-4 w-4" />
              <span>{option.label}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {categoryOptions.map(option => (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => setActiveCategory(option.value as typeof activeCategory)}
              className={cn("flex items-center gap-2", activeCategory === option.value && "bg-accent text-accent-foreground")}
            >
              <Tag className="h-4 w-4" />
              <span>{option.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Reset Button */}
      {isFiltered && (
        <Button variant="ghost" onClick={resetFilters} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium">
          <XCircle className="h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </motion.div>
  );
};

export default ProgramsFilters;
