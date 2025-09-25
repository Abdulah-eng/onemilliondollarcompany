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
  
  const getSectionItems = (section: MealSection) => data[section] || [];

  // --- COMPONENT RENDER ---
  return (
    <div className="p-3 md:p-4 space-y-4 h-full"> 
      <h3 className="text-xl font-bold text-foreground">Daily Summary</h3>
      
      {/* Total Macros Card - Modern, Stable Layout */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-card to-background shadow-xl border border-border/50 flex flex-col gap-4">
        
        {/* Total Calories Block - Primary Focus */}
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-between">
            <h4 className="flex items-center gap-1 text-sm font-semibold text-primary">
                <Flame className="h-4 w-4" />
                TOTAL Kcal
            </h4>
            <span className="text-3xl font-extrabold text-primary">
                {totalMacros.calories} 
                <span className='text-xs font-medium ml-1 text-primary/80'>Kcal</span>
            </span>
        </div>

        {/* Macro Breakdown - Stable Grid (Avoids overlap) */}
        <div className="grid grid-cols-3 gap-2">
            {/* Macro Box structure for stability and modernity */}
            {[
                { label: 'Protein', value: totalMacros.protein, icon: Beef, color: 'text-green-500' },
                { label: 'Carbs', value: totalMacros.carbs, icon: Carrot, color: 'text-orange-500' },
                { label: 'Fat', value: totalMacros.fat, icon: Snowflake, color: 'text-blue-400' },
            ].map((macro) => (
                <div key={macro.label} className='flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/30 shadow-inner h-[80px]'>
                    <macro.icon className={`h-5 w-5 ${macro.color}`} />
                    <span className='font-extrabold text-xl text-foreground mt-1 leading-none truncate max-w-full'>
                        {macro.value}g
                    </span>
                    <span className='text-xs text-muted-foreground leading-none mt-1'>{macro.label}</span>
                </div>
            ))}
        </div>
      </div>
      
      {/* Meal Schedule Section */}
      <h4 className="text-lg font-bold pt-2 border-b pb-1 border-border/70">Meal Schedule</h4>
      
      {/* Content Area - Ensured scrollable area with safe height */}
      <div className="space-y-3 text-sm text-muted-foreground overflow-y-auto max-h-[calc(100vh-25rem)] pr-1"> 
        <AnimatePresence mode="popLayout">
          {allItems.length > 0 ? (
            Object.keys(data).map((sectionKey) => {
                const section = sectionKey as MealSection;
                const items = getSectionItems(section);

                if (items.length === 0) return null;

                return (
                    // Meal Section: Clean, modern separator
                    <div key={section} className='space-y-2 pb-3 border-b border-border/70 last:border-b-0'> 
                        <h5 className='font-semibold text-sm text-primary capitalize flex items-center gap-2 pt-1'>
                            <BookOpenText className='h-3 w-3'/> {section.replace('snack', ' Snack')}
                        </h5>
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col p-3 bg-background rounded-lg border border-border/50 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-foreground text-sm flex-1 truncate pr-2">
                                        {item.recipe.name}
                                    </span>
                                    {item.time && (
                                        <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0 ml-2">
                                            <Clock className='h-3 w-3'/> {item.time}
                                        </span>
                                    )}
                                </div>
                                <div className='flex items-center justify-between text-xs text-muted-foreground'>
                                    <p className="flex items-center gap-1">
                                        <Scale className='h-3 w-3 text-primary/70'/> {item.portionSize} 
                                    </p>
                                    <p className='font-medium text-primary/80'>
                                        {item.recipe.calories} kcal
                                    </p>
                                </div>
                                {item.comment && (
                                    <p className="italic text-xs text-muted-foreground/80 mt-1 line-clamp-1">
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
              <p>Add recipes to start tracking macros.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NutritionSummary;
