// src/components/coach/clientCard/ClientProgress/ProgramFill.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { CheckCircle } from 'lucide-react';

interface ProgramFillProps {
  programFill: { fitness: number; nutrition: number; mentalHealth: number };
}

const ProgramFill: React.FC<ProgramFillProps> = ({ programFill }) => {
  const sections = [
    { label: 'Fitness', value: programFill.fitness, color: '#6366f1' },
    { label: 'Nutrition', value: programFill.nutrition, color: '#10b981' },
    { label: 'Mental Health', value: programFill.mentalHealth, color: '#f59e0b' },
  ];

  return (
    <Card className="shadow-lg rounded-xl bg-card p-6 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="text-xl font-bold tracking-tight text-foreground">Program Completion ✅</h4>
          <p className="text-sm text-muted-foreground mt-1">Overall progress across all program types</p>
        </div>
      </div>
      
      <div className="flex gap-4 w-full justify-around mt-6">
        {sections.map((section) => (
          <div key={section.label} className="w-24 h-24 flex flex-col items-center">
            <CircularProgressbar
              value={section.value}
              text={`${section.value}%`}
              strokeWidth={8}
              styles={buildStyles({
                pathColor: section.color,
                trailColor: '#e5e7eb',
                textColor: 'hsl(var(--foreground))',
                textSize: '18px',
              })}
            />
            <p className="text-sm font-semibold text-center mt-3">{section.label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProgramFill;
