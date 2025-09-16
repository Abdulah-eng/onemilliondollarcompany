// src/components/coach/programs/ProgramCard.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ClipboardCheck, Pencil, Play, Clock, Crown, Users } from 'lucide-react';
import { Program } from '@/mockdata/programs/mockCoachPrograms';

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
        <Button variant="outline" className="text-sm px-3 h-8 gap-1" onClick={() => onEdit(program)}>
          <Users className="h-4 w-4" />
          <span className="hidden md:inline">Manage</span>
        </Button>
      );
    case 'scheduled':
      return (
        <Button variant="outline" className="text-sm px-3 h-8 gap-1" onClick={() => onEdit(program)}>
          <Pencil className="h-4 w-4" />
          <span className="hidden md:inline">Edit Plan</span>
        </Button>
      );
    case 'draft':
      return (
        <Button className="text-sm px-3 h-8 gap-1" onClick={() => onEdit(program)}>
          <Pencil className="h-4 w-4" />
          <span className="hidden md:inline">Continue Editing</span>
        </Button>
      );
    default:
      return (
        <Button className="text-sm px-3 h-8 gap-1" onClick={() => onAssign(program)}>
          <ClipboardCheck className="h-4 w-4" />
          <span className="hidden md:inline">Assign</span>
        </Button>
      );
  }
};

export const ProgramCard: React.FC<ProgramCardProps> = ({ program, onEdit, onAssign }) => {
  const isPremium = program.category === 'mental health';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="flex flex-col sm:flex-row items-center p-4 gap-4 hover:shadow-lg transition-shadow">
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge(program.status)}
            {getCategoryBadge(program.category)}
            {isPremium && <Badge variant="outline" className="text-yellow-500 border-yellow-200"><Crown className="h-3 w-3 mr-1" />Premium</Badge>}
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold">{program.name}</CardTitle>
            <CardDescription className="line-clamp-2">{program.description}</CardDescription>
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          {getActionButton(program, onEdit, onAssign)}
        </div>
      </Card>
    </motion.div>
  );
};
