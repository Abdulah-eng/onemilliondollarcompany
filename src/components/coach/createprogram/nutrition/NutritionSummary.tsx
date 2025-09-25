// src/components/coach/createprogram/nutrition/NutritionSummary.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NutritionDayItem, MealSection } from './NutritionDay';
import { Utensils, Clock, Flame, Beef, Carrot, Snowflake, Scale } from 'lucide-react';

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

  return (
    // Adjusted padding for tighter fit in the side column, but still comfortable
    <div className="p-3 md:p-4 space-y-4 h-full"> 
      <h3 className="text-xl font-bold text-foreground/90">Daily Summary</h3>
      
      {/* Total Macros Card - Enhanced Design */}
      <div className="p-4 rounded-xl bg-card border border-border shadow-md flex flex-col gap-3">
        
        <div className="flex items-center justify-between border-b pb-2">
            <h4 className="flex items-center gap-2 text-lg font-bold text-primary">
                <Flame className="h-5 w-5" />
                Total Calories
            </h4>
            <span className="text-2xl font-extrabold text-primary">
                {totalMacros.calories} 
                <span className='text-sm font-medium ml-1 text-primary/80'>Kcal</span>
            </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
            {/* Protein */}
            <div className='flex flex-col items-center p-2 rounded-lg bg-secondary/50'>
                <Beef className='h-4 w-4 text-green-600 mb-1'/>
                <span className='font-bold text-lg text-foreground'>{totalMacros.protein}g</span>
                <span className='text-xs text-muted-foreground'>Protein</span>
            </div>
            {/* Carbs */}
            <div className='flex flex-col items-center p-2 rounded-lg bg-secondary/50'>
                <Carrot className='h-4 w-4 text-orange-600 mb-1'/>
                <span className='font-bold text-lg text-foreground'>{totalMacros.carbs}g</span>
                <span className='text-xs text-muted-foreground'>Carbs</span>
            </div>
            {/* Fat */}
            <div className='flex flex-col items-center p-2 rounded-lg bg-secondary/50'>
                <Snowflake className='h-4 w-4 text-blue-600 mb-1'/>
                <span className='font-bold text-lg text-foreground'>{totalMacros.fat}g</span>
                <span className='text-xs text-muted-foreground'>Fat</span>
            </div>
        </div>
      </div>
      
      {/* Meal Breakdown */}
      <h4 className="text-lg font-semibold pt-2">Meal Schedule</h4>
      {/* Reduced max-height for better mobile/tablet viewing area */}
      <div className="space-y-3 text-sm text-muted-foreground overflow-y-auto max-h-[calc(100vh-28rem)]"> 
        <AnimatePresence mode="popLayout">
          {allItems.length > 0 ? (
            Object.keys(data).map((sectionKey) => {
                const section = sectionKey as MealSection;
                const items = getSectionItems(section);

                if (items.length === 0) return null;

                return (
                    // Use a subtle card-like structure for the section
                    <div key={section} className='space-y-2 p-2 rounded-lg bg-secondary/30'> 
                        <h5 className='font-bold text-sm text-foreground capitalize flex items-center gap-1 border-b border-border/70 pb-1'>
                            <Utensils className='h-3 w-3 text-primary'/> {section.replace('snack', ' Snack')}
                        </h5>
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col p-2 bg-background rounded-md border border-border/50 shadow-sm"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-foreground text-sm flex-1 truncate">
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
                                        <Scale className='h-3 w-3'/> {item.portionSize} 
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
              <p>Add recipes to start tracking macros.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NutritionSummary;
