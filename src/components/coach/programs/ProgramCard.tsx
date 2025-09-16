// src/components/coach/programs/ProgramCard.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ClipboardCheck, Pencil, Play, Clock, Crown, Users } from 'lucide-react';
import { Program } from '@/types/program';

interface ProgramCardProps {
  program: Program;
  onEdit: (program: Program) => void;
  onAssign: (program: Program) => void;
}

const getStatusBadge = (status: Program['status']) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"><Play className="h-3 w-3 mr-1" /> Active</Badge>;
    case 'scheduled':
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100"><Clock className="h-3 w-3 mr-1" /> Scheduled</Badge>;
    case 'draft':
      return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100"><Pencil className="h-3 w-3 mr-1" /> Draft</Badge>;
    default:
      return <Badge variant="secondary">Normal</Badge>;
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

const getActionButton = (program: Program, onEdit: (p: Program) => void, onAssign: (p: Program) => void) => {
  switch (program.status) {
    case 'active':
      return (
        <Button variant="ghost" className="text-sm px-2 h-8" onClick={() => onEdit(program)}>
          <Users className="h-4 w-4 mr-1" /> Manage
        </Button>
      );
    case 'scheduled':
      return (
        <Button variant="ghost" className="text-sm px-2 h-8" onClick={() => onEdit(program)}>
          <Pencil className="h-4 w-4 mr-1" /> Edit Plan
        </Button>
      );
    case 'draft':
      return (
        <Button className="text-sm px-2 h-8" onClick={() => onEdit(program)}>
          <Pencil className="h-4 w-4 mr-1" /> Continue Editing
        </Button>
      );
    default:
      return (
        <Button className="text-sm px-2 h-8" onClick={() => onAssign(program)}>
          <ClipboardCheck className="h-4 w-4 mr-1" /> Assign
        </Button>
      );
  }
};

export const ProgramCard: React.FC<ProgramCardProps> = ({ program, onEdit, onAssign }) => {
  const isPremium = program.category === 'mental health'; // Example for a premium feature

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            {getStatusBadge(program.status)}
            {isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="mb-4">
            <CardTitle className="text-xl font-semibold mb-1 truncate">{program.name}</CardTitle>
            <CardDescription className="line-clamp-2">{program.description}</CardDescription>
          </div>
          <div className="flex justify-between items-center">
            {getCategoryBadge(program.category)}
            {getActionButton(program, onEdit, onAssign)}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
