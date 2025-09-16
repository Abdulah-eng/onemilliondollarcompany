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
      className="flex flex-col md:flex-row items-center gap-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex flex-col md:flex-row items-center w-full gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search programs..."
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Combined Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter by
              <ChevronDown className="h-4 w-4 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel className="font-bold">Status: {getStatusLabel(activeStatus)}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={activeStatus} onValueChange={setActiveStatus}>
              {statusOptions.map(option => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  <option.icon className="h-4 w-4 mr-2" />
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            
            <DropdownMenuSeparator />

            <DropdownMenuLabel className="font-bold">Category: {getCategoryLabel(activeCategory)}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={activeCategory} onValueChange={setActiveCategory}>
              {categoryOptions.map(option => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  <Tag className="h-4 w-4 mr-2" />
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};

export default ProgramsFilters;
