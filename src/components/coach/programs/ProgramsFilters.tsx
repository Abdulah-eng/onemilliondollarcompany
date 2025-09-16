// src/components/coach/programs/ProgramsFilters.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ChevronDown, Filter, Play, Clock, Pencil, ClipboardCheck, Tag, LayoutGrid } from 'lucide-react';
import { ProgramCategory, ProgramStatus } from '@/mockdata/programs/mockCoachPrograms';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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
    { value: 'normal', label: 'Normal', icon: ClipboardCheck },
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
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search programs..."
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters (Desktop) */}
        <div className="hidden md:flex items-center gap-2 w-full md:w-auto">
          <Select value={activeStatus} onValueChange={setActiveStatus}>
            <SelectTrigger className="w-auto min-w-[150px] gap-2">
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Status</span>
              </span>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className="h-4 w-4" />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger className="w-auto min-w-[150px] gap-2">
              <span className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span>Category</span>
              </span>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filters (Mobile) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="md:hidden w-full flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
              <ChevronDown className="h-4 w-4 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={activeStatus} onValueChange={setActiveStatus}>
              {statusOptions.map(option => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  <option.icon className="h-4 w-4 mr-2" />
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuLabel className="mt-2">Filter by Category</DropdownMenuLabel>
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
