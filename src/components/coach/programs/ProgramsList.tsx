// src/components/coach/programs/ProgramsList.tsx
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import ProgramsFilters from '@/components/coach/programs/ProgramsFilters';
import { mockCoachPrograms } from '@/mockdata/programs/mockCoachPrograms';
import { Program, ProgramCategory, ProgramStatus } from '@/mockdata/programs/mockCoachPrograms';
import { Frown, Play, Clock, Pencil, ClipboardCheck, MoreHorizontal, Users, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const getStatusBadge = (status: Program['status']) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 min-w-[100px] justify-center"><Play className="h-3 w-3 mr-1" /> Active</Badge>;
    case 'scheduled':
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 min-w-[100px] justify-center"><Clock className="h-3 w-3 mr-1" /> Scheduled</Badge>;
    case 'draft':
      return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 min-w-[100px] justify-center"><Pencil className="h-3 w-3 mr-1" /> Draft</Badge>;
    default:
      return <Badge variant="secondary" className="min-w-[100px] justify-center">Normal</Badge>;
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

  const handleEditProgram = useCallback((program: Program) => {
    console.log('Editing program:', program.name);
  }, []);

  const handleAssignProgram = useCallback((program: Program) => {
    console.log('Assigning program:', program.name);
  }, []);
  
  const handleDeleteProgram = useCallback((program: Program) => {
    console.log('Deleting program:', program.name);
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
        <Card>
          <div className="hidden md:flex p-4 text-sm font-semibold text-muted-foreground border-b">
            <span className="w-[120px] shrink-0">Status</span>
            <span className="flex-1">Program Name</span>
            <span className="w-[120px] shrink-0 text-right">Actions</span>
          </div>
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map(program => (
              <div
                key={program.id}
                className="flex flex-col md:flex-row items-start md:items-center p-4 gap-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors"
              >
                {/* Status Badge */}
                <div className="w-full md:w-[120px] shrink-0 flex items-center md:items-start justify-between md:justify-start">
                  {getStatusBadge(program.status)}
                  <span className="md:hidden text-sm font-semibold text-muted-foreground">Actions</span>
                </div>
                
                {/* Program Details */}
                <div className="flex-1 flex flex-col gap-1 w-full md:w-auto">
                  <h3 className="text-lg font-semibold">{program.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{program.description}</p>
                </div>
                
                {/* Actions */}
                <div className="w-full md:w-[120px] shrink-0 flex items-center justify-end md:justify-center gap-2 mt-2 md:mt-0">
                  <Button variant="ghost" size="icon" onClick={() => handleEditProgram(program)}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Pencil className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                  </Button>
                  {program.status === 'normal' && (
                    <Button variant="ghost" size="icon" onClick={() => handleAssignProgram(program)}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Users className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>Assign</TooltipContent>
                      </Tooltip>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteProgram(program)}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <Card className="col-span-full flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <Frown className="h-12 w-12 mb-4" />
              <h3 className="font-semibold text-xl">No programs found</h3>
              <p>Try adjusting your search or filters.</p>
            </Card>
          )}
        </Card>
      </motion.div>
    </>
  );
};

export default ProgramsList;
