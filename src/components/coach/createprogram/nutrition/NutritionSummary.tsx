// src/components/coach/createprogram/nutrition/NutritionSummary.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NutritionDayItem, MealSection } from './NutritionDay';
import { Utensils, Clock, Flame, Beef, Carrot, Snowflake, Scale, BookOpenText } from 'lucide-react';

interface NutritionSummaryProps {
  data: { [key in MealSection]: NutritionDayItem[] };
  activeDay: string;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ data, activeDay }) => {
  const allItems = Object.values(data).flat();
  
  const totalMacros = allItems.reduce(
    (acc, item) => {
      acc.calories += item.recipe.calories;
      acc.protein += item.recipe.protein;
      acc.carbs += item.recipe.carbs;
      acc.fat += item.recipe.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="p-3 md:p-4 space-y-4 h-full overflow-hidden">
      <h3 className="text-lg font-bold text-foreground">Daily Summary</h3>
      
      {/* Total Macros */}
      <div className="p-3 rounded-xl bg-gradient-to-br from-card to-background shadow-lg border border-border/50 flex flex-col gap-3">
        <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
          <h4 className="flex items-center gap-1 text-xs font-semibold text-primary/80 uppercase">
            <Flame className="h-4 w-4 shrink-0" />
            Total Kcal
          </h4>
          <span className="text-2xl font-extrabold text-primary truncate">
            {totalMacros.calories} 
            <span className='text-xs font-medium ml-1 text-primary/70'>Kcal</span>
          </span>
        </div>

        {/* Macro Breakdown */}
        <div className="grid grid-cols-3 gap-1">
          {[
            { label: 'Protein', value: totalMacros.protein, icon: Beef, color: 'text-green-500' },
            { label: 'Carbs', value: totalMacros.carbs, icon: Carrot, color: 'text-orange-500' },
            { label: 'Fat', value: totalMacros.fat, icon: Snowflake, color: 'text-blue-400' },
          ].map((macro) => (
            <div 
              key={macro.label} 
              className='flex flex-col items-center justify-center p-1 rounded-md bg-secondary/30 h-[65px] overflow-hidden'
            >
              <macro.icon className={`h-4 w-4 shrink-0 ${macro.color}`} />
              <span className='font-bold text-lg text-foreground mt-1 leading-none truncate max-w-full'>
                {macro.value}g
              </span>
              <span className='text-[10px] text-muted-foreground leading-none mt-1 uppercase truncate max-w-full'>
                {macro.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Meals */}
      <h4 className="text-base font-bold pt-2 border-b pb-1 border-border/70">Meal Schedule</h4>
      
      <div className="space-y-3 text-sm text-muted-foreground overflow-y-auto max-h-[calc(100vh-22rem)] pr-1">
        <AnimatePresence mode="popLayout">
          {allItems.length > 0 ? (
            Object.keys(data).map((sectionKey) => {
              const section = sectionKey as MealSection;
              const items = data[section] || [];

              if (items.length === 0) return null;

              return (
                <div key={section} className='space-y-2 pb-3 border-b border-border/70 last:border-b-0'>
                  <h5 className='font-semibold text-xs text-primary/90 uppercase flex items-center gap-1 pt-1'>
                    <BookOpenText className='h-3 w-3 shrink-0'/> {section.replace('snack', ' Snack')}
                  </h5>

                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col p-2 bg-background rounded-lg border border-border/50 shadow-sm overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-1 min-w-0">
                        <span className="font-medium text-foreground text-sm flex-1 truncate pr-2 min-w-0">
                          {item.recipe.name}
                        </span>
                        {item.time && (
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1 shrink-0 ml-2">
                            <Clock className='h-3 w-3 shrink-0'/> {item.time}
                          </span>
                        )}
                      </div>
                      <div className='flex items-center justify-between text-xs text-muted-foreground min-w-0'>
                        <p className="flex items-center gap-1 truncate">
                          <Scale className='h-3 w-3 text-primary/70 shrink-0'/> {item.portionSize}
                        </p>
                        <p className='font-medium text-primary/80 shrink-0'>
                          {item.recipe.calories} kcal
                        </p>
                      </div>
                      {item.comment && (
                        <p className="italic text-[11px] text-muted-foreground/80 mt-1 line-clamp-1">
                          "{item.comment}"
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <Utensils className="h-8 w-8 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm">Add recipes to start tracking macros.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NutritionSummary;
