// src/components/coach/createprogram/mentalhealth/MentalHealthSummary.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MentalHealthDayItem, MentalHealthSection } from './MentalHealthDay';
import { Feather, Clock, Sun, Moon, Zap, Target } from 'lucide-react';

interface MentalHealthSummaryProps {
  data: { [key in MentalHealthSection]: MentalHealthDayItem[] };
  activeDay: string;
}

const MentalHealthSummary: React.FC<MentalHealthSummaryProps> = ({ data, activeDay }) => {
  const allItems = Object.values(data).flat();
  
  const totalDuration = allItems.reduce(
    (total, item) => total + item.activity.durationMinutes, 0
  );
  
  const getSectionItems = (section: MentalHealthSection) => data[section] || [];

  const getSectionIcon = (section: MentalHealthSection) => {
    switch (section) {
        case 'morning': return <Sun className='h-4 w-4 text-orange-500'/>;
        case 'evening': return <Zap className='h-4 w-4 text-purple-500'/>;
        case 'night': return <Moon className='h-4 w-4 text-blue-500'/>;
    }
  };

  return (
    <div className="p-3 md:p-4 space-y-4 h-full"> 
      <h3 className="text-lg font-bold text-foreground">Daily Wellness Summary</h3>
      
      {/* Total Duration Card */}
      <div className="p-3 rounded-xl bg-card border border-border shadow-lg flex flex-col gap-3">
        
        <div className="flex items-center justify-between p-2 rounded-lg bg-primary/10">
            <h4 className="flex items-center gap-1 text-xs font-semibold text-primary/80 uppercase">
                <Clock className="h-4 w-4" />
                Total Activity Time
            </h4>
            <span className="text-2xl font-extrabold text-primary">
                {totalDuration} 
                <span className='text-xs font-medium ml-1 text-primary/70'>min</span>
            </span>
        </div>

        {/* Focus Areas (Simple count) */}
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <Target className='h-4 w-4 text-purple-500'/>
            <span className='font-semibold'>Activities: {allItems.length}</span>
            <span>Focus Areas: {Array.from(new Set(allItems.flatMap(item => item.activity.focusAreas))).length}</span>
        </div>
      </div>
      
      {/* Activity Breakdown */}
      <h4 className="text-base font-bold pt-2 border-b pb-1 border-border/70">Routine Breakdown</h4>
      
      <div className="space-y-3 text-sm text-muted-foreground overflow-y-auto max-h-[calc(100vh-22rem)] pr-1"> 
        <AnimatePresence mode="popLayout">
          {allItems.length > 0 ? (
            ['morning', 'evening', 'night'].map((sectionKey) => {
                const section = sectionKey as MentalHealthSection;
                const items = getSectionItems(section);

                if (items.length === 0) return null;

                return (
                    <div key={section} className='space-y-2 pb-3 border-b border-border/70 last:border-b-0'> 
                        <h5 className='font-semibold text-xs text-foreground uppercase flex items-center gap-1 pt-1'>
                            {getSectionIcon(section)} {section}
                        </h5>
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center justify-between p-2 bg-background/50 rounded-lg border border-border/50 shadow-sm"
                            >
                                <span className="font-medium text-foreground text-sm flex-1 truncate pr-2">
                                    {item.activity.name}
                                </span>
                                <span className='text-xs text-muted-foreground flex items-center gap-1 shrink-0'>
                                    {item.activity.durationMinutes} min
                                </span>
                            </motion.div>
                        ))}
                    </div>
                );
            })
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <Feather className="h-8 w-8 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm">Plan your day to see a summary.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MentalHealthSummary;
