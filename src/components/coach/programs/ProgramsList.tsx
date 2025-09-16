// src/components/coach/programs/ProgramsList.tsx
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import ProgramsFilters from '@/components/coach/programs/ProgramsFilters';
import { mockCoachPrograms } from '@/mockdata/programs/mockCoachPrograms';
import { Program, ProgramCategory, ProgramStatus } from '@/mockdata/programs/mockCoachPrograms';
import { Frown, Play, Clock, Pencil, ClipboardCheck, Users, Trash2, Calendar, MoreHorizontal, Tag, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Mock data for clients to display in the list
const mockClients = [
  { id: 'client-1', name: 'John Doe' },
  { id: 'client-2', name: 'Jane Smith' },
  { id: 'client-3', name: 'Alex Johnson' },
  { id: 'client-4', name: 'Sarah Williams' },
];

const getStatusBadge = (status: Program['status']) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 w-fit min-w-[90px] justify-center"><Play className="h-3 w-3 mr-1" /> Active</Badge>;
    case 'scheduled':
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 w-fit min-w-[90px] justify-center"><Clock className="h-3 w-3 mr-1" /> Scheduled</Badge>;
    case 'draft':
      return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 w-fit min-w-[90px] justify-center"><Pencil className="h-3 w-3 mr-1" /> Draft</Badge>;
    default:
      return <Badge variant="secondary" className="w-fit min-w-[90px] justify-center">Normal</Badge>;
  }
};

const getCategoryBadge = (category: Program['category']) => {
  switch (category) {
    case 'fitness':
      return <Badge variant="outline" className="text-purple-600 border-purple-200">Fitness</Badge>;
    case 'nutrition':
      return <Badge variant="outline" className="text-teal-600 border-teal-200">Nutrition</Badge>;
    case 'mental health':
      return <Badge variant="outline" className="text-indigo-600 border-indigo-200">Mental Health</Badge>;
    default:
      return null;
  }
};

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

  const getClientName = (clientId: string | null) => {
    const client = mockClients.find(c => c.id === clientId);
    return client?.name || 'Unassigned';
  };

  const handleAction = useCallback((action: string, program: Program) => {
    console.log(`${action} program:`, program.name);
    // Here you would implement your logic for each action
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
        <Card className="divide-y">
          {/* Header Row (Desktop) */}
          <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_0.5fr] p-4 text-sm font-semibold text-muted-foreground">
            <span>Program Name</span>
            <span>Category</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          {filteredPrograms.length > 0 ? (
            filteredPrograms.map(program => (
              <div
                key={program.id}
                className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_0.5fr] items-center p-4 gap-4 md:gap-6 hover:bg-muted/50 transition-colors"
              >
                {/* Program Name & Client Name */}
                <div className="flex flex-col gap-1 md:gap-0">
                  <h3 className="text-lg font-semibold">{program.name}</h3>
                  {program.assignedTo ? (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Assigned to: {getClientName(program.assignedTo)}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">Unassigned</span>
                  )}
                </div>
                
                {/* Category Badge */}
                <div className="md:block hidden">
                  {getCategoryBadge(program.category)}
                </div>

                {/* Status Badge */}
                <div className="md:block hidden">
                  {getStatusBadge(program.status)}
                </div>

                {/* Mobile View: Category & Status */}
                <div className="md:hidden flex flex-wrap gap-2">
                  {getCategoryBadge(program.category)}
                  {getStatusBadge(program.status)}
                  {program.category === 'mental health' && (
                    <Badge variant="outline" className="text-yellow-500 border-yellow-200"><Crown className="h-3 w-3 mr-1" />Premium</Badge>
                  )}
                </div>

                {/* Actions Dropdown */}
                <div className="flex justify-start md:justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleAction('delete', program)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction('edit', program)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {program.status === 'normal' && (
                        <>
                          <DropdownMenuItem onClick={() => handleAction('assign', program)}>
                            <Users className="h-4 w-4 mr-2" />
                            Assign
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('schedule', program)}>
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule
                          </DropdownMenuItem>
                        </>
                      )}
                      {program.status === 'scheduled' && (
                        <DropdownMenuItem onClick={() => handleAction('assign', program)}>
                          <Users className="h-4 w-4 mr-2" />
                          Assign Now
                        </DropdownMenuItem>
                      )}
                      {program.status === 'draft' && (
                        <DropdownMenuItem onClick={() => handleAction('assign', program)}>
                          <Users className="h-4 w-4 mr-2" />
                          Assign Draft
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <Frown className="h-12 w-12 mb-4" />
              <h3 className="font-semibold text-xl">No programs found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </Card>
      </motion.div>
    </>
  );
};

export default ProgramsList;
