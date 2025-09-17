'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import ProgramsFilters from '@/components/coach/programs/ProgramsFilters';
import { mockCoachPrograms } from '@/mockdata/programs/mockCoachPrograms';
import { Program, ProgramCategory, ProgramStatus } from '@/mockdata/programs/mockCoachPrograms';
import { Frown, Play, Clock, Pencil, Users, Trash2, Calendar, MoreHorizontal, PlusCircle } from 'lucide-react';
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
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 min-w-[90px] justify-center"><Play className="h-3 w-3 mr-1" /> Active</Badge>;
    case 'scheduled':
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 min-w-[90px] justify-center"><Clock className="h-3 w-3 mr-1" /> Scheduled</Badge>;
    case 'draft':
      return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 min-w-[90px] justify-center"><Pencil className="h-3 w-3 mr-1" /> Draft</Badge>;
    default:
      return <Badge variant="secondary" className="min-w-[90px] justify-center">Normal</Badge>;
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
      const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [activeStatus, activeCategory, searchQuery]);

  const getClientName = (clientId: string | null) => {
    const client = mockClients.find(c => c.id === clientId);
    return client?.name || 'Unassigned';
  };

  const handleAction = useCallback((action: string, program: Program) => {
    console.log(`${action} program:`, program.name);
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8">My Programs</h1>
      
      <div className="mb-8">
        <ProgramsFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      </div>

      <motion.div
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AnimatePresence>
          {filteredPrograms.length > 0 ? (
            <div className="flex flex-col gap-4">
              {/* Table Header for larger screens */}
              <div className="hidden md:grid grid-cols-4 gap-4 p-4 text-sm font-semibold text-muted-foreground border-b-2">
                <div className="col-span-2">Program Name</div>
                <div>Assigned Client</div>
                <div className="text-right">Status</div>
              </div>

              {/* Programs List */}
              {filteredPrograms.map((program, index) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 bg-background/50 backdrop-blur-sm">
                    {/* Desktop View */}
                    <div className="hidden md:grid grid-cols-4 items-center gap-4 p-4">
                      {/* Program Name */}
                      <div className="col-span-2 flex flex-col">
                        <span className="font-semibold text-lg group-hover:text-primary transition-colors">{program.name}</span>
                        {/* Removed: <span className="text-sm text-muted-foreground truncate">{program.description}</span> */}
                      </div>

                      {/* Client */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4 shrink-0" />
                        <span className="truncate">{getClientName(program.assignedTo)}</span>
                      </div>

                      {/* Status */}
                      <div className="text-right flex items-center justify-end gap-2">
                        {getStatusBadge(program.status)}
                        {/* Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-75 hover:opacity-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleAction('view', program)}>View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('edit', program)}>Edit Program</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('delete', program)} className="text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Program
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden p-4 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold group-hover:text-primary">{program.name}</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleAction('view', program)}>View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('edit', program)}>Edit Program</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('delete', program)} className="text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Program
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4 shrink-0" />
                        <span>Client: {getClientName(program.assignedTo)}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {getStatusBadge(program.status)}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed rounded-xl"
            >
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                <Frown className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-2xl mb-2">No programs found</h3>
              <p className="text-muted-foreground text-lg max-w-md mb-6">
                Try adjusting your search terms or filters to find what you're looking for, or create a new program.
              </p>
              <Button onClick={() => console.log("Create new program")} className="gap-2">
                <PlusCircle className="h-5 w-5" />
                Create New Program
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProgramsList;
