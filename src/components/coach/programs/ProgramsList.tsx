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
        <div className="grid gap-4 md:gap-6">
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 bg-background/50 backdrop-blur-sm">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                              {program.name}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-3 max-w-2xl">
                              {program.description}
                            </p>
                          </div>
                          
                          {/* Actions Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => handleAction('edit', program)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Program
                              </DropdownMenuItem>
                              {program.status === 'normal' && (
                                <>
                                  <DropdownMenuItem onClick={() => handleAction('assign', program)}>
                                    <Users className="h-4 w-4 mr-2" />
                                    Assign to Client
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleAction('schedule', program)}>
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Schedule Program
                                  </DropdownMenuItem>
                                </>
                              )}
                              {program.status === 'scheduled' && (
                                <DropdownMenuItem onClick={() => handleAction('assign', program)}>
                                  <Play className="h-4 w-4 mr-2" />
                                  Assign Now
                                </DropdownMenuItem>
                              )}
                              {program.status === 'draft' && (
                                <DropdownMenuItem onClick={() => handleAction('assign', program)}>
                                  <Users className="h-4 w-4 mr-2" />
                                  Assign Draft
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleAction('delete', program)} className="text-destructive focus:text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Program
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Assigned Client */}
                        {program.assignedTo ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <Users className="h-4 w-4" />
                            <span>Assigned to:</span>
                            <Badge variant="secondary" className="font-medium">
                              {getClientName(program.assignedTo)}
                            </Badge>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <Users className="h-4 w-4" />
                            <span className="italic">Unassigned program</span>
                          </div>
                        )}

                        {/* Badges Row */}
                        <div className="flex flex-wrap items-center gap-3">
                          {getCategoryBadge(program.category)}
                          {getStatusBadge(program.status)}
                          {program.category === 'mental health' && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">
                              <Crown className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center p-16 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                <Frown className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-2xl mb-2">No programs found</h3>
              <p className="text-muted-foreground text-lg max-w-md">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default ProgramsList;
