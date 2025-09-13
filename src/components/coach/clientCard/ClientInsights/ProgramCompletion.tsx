// src/components/coach/clientCard/ClientInsights/ProgramCompletion.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { CheckCircle } from 'lucide-react';
import { mockClientData } from '@/mockdata/clientCard/mockClientData';

interface ProgramCompletionProps {
  programFill: typeof mockClientData.programFill;
}

const ProgramCompletion: React.FC<ProgramCompletionProps> = ({ programFill }) => {
  const sections = [
    { label: 'Fitness', value: programFill.fitness, color: '#2563eb' },
    { label: 'Nutrition', value: programFill.nutrition, color: '#f59e0b' },
    { label: 'Mental Health', value: programFill.mentalHealth, color: '#10b981' },
  ];

  return (
    <Card className="rounded-2xl border bg-card p-6 shadow-sm">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-primary" />
          Program Adherence
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          A snapshot of overall program completion and consistency.
        </p>
      </CardHeader>
      <CardContent className="p-0 flex flex-col md:flex-row gap-8 items-center justify-around">
        {sections.map((section, index) => (
          <motion.div
            key={section.label}
            className="w-28 h-28 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          >
            <CircularProgressbar
              value={section.value}
              text={`${section.value}%`}
              strokeWidth={8}
              styles={buildStyles({
                pathColor: section.color,
                trailColor: 'hsl(var(--muted))',
                textColor: 'hsl(var(--foreground))',
                textSize: '18px',
              })}
            />
            <p className="text-sm font-semibold text-center mt-3 text-foreground">
              {section.label}
            </p>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProgramCompletion;
