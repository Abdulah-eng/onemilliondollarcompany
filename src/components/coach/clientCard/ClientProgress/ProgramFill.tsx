// src/components/coach/clientCard/ClientProgress/ProgramFill.tsx
import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

interface ProgramFillProps {
  programFill: { fitness: number; nutrition: number; wellness: number };
}

const ProgramFill: React.FC<ProgramFillProps> = ({ programFill }) => {
  const sections = [
    { label: 'Fitness', value: programFill.fitness, color: '#6366f1' },
    { label: 'Nutrition', value: programFill.nutrition, color: '#10b981' },
    { label: 'Wellness', value: programFill.wellness, color: '#f59e0b' },
  ];

  return (
    <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex flex-col items-center">
      <h4 className="font-semibold text-md text-foreground mb-2">Program Fill</h4>
      <div className="flex gap-4 w-full justify-around">
        {sections.map((section) => (
          <div key={section.label} className="w-20 h-20">
            <CircularProgressbar
              value={section.value}
              text={`${section.value}%`}
              strokeWidth={8}
              styles={buildStyles({
                pathColor: section.color,
                trailColor: '#e5e7eb',
                textColor: '#1e293b',
                textSize: '16px',
              })}
            />
            <p className="text-sm text-center mt-1">{section.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramFill;
