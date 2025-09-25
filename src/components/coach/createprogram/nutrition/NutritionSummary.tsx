// src/components/coach/createprogram/nutrition/NutritionSummary.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NutritionDayItem, MealSection } from './NutritionDay';
import { Utensils, Clock, Flame, Beef, Carrot } from 'lucide-react';

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
    <div className="p-4 md:p-6 space-y-4 h-full">
      <h3 className="text-xl font-bold">Daily Macro Overview - {activeDay}</h3>
      
      {/* Total Macros Card */}
      <div className="p-4 rounded-xl bg-primary text-primary-foreground shadow-lg flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
            <Flame className="h-5 w-5" />
            <span className="text-lg font-bold">Total: {totalMacros.calories} Kcal</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm font-medium">
            <div className='flex flex-col items-center'>
                <span className='font-bold text-xl'>{totalMacros.protein}g</span>
                <span className='text-xs opacity-80'>Protein</span>
            </div>
            <div className='flex flex-col items-center'>
                <span className='font-bold text-xl'>{totalMacros.carbs}g</span>
                <span className='text-xs opacity-80'>Carbs</span>
            </div>
            <div className='flex flex-col items-center'>
                <span className='font-bold text-xl'>{totalMacros.fat}g</span>
                <span className='text-xs opacity-80'>Fat</span>
            </div>
        </div>
      </div>
      
      {/* Meal Breakdown */}
      <h4 className="text-lg font-semibold pt-2">Meal Breakdown</h4>
      <div className="space-y-4 text-sm text-muted-foreground overflow-y-auto max-h-[calc(100vh-32rem)]">
        <AnimatePresence mode="popLayout">
          {allItems.length > 0 ? (
            Object.keys(data).map((sectionKey) => {
                const section = sectionKey as MealSection;
                const items = getSectionItems(section);

                if (items.length === 0) return null;

                return (
                    <div key={section} className='space-y-2 border-b pb-2'>
                        <h5 className='font-bold text-foreground capitalize'>{section.replace('snack', ' Snack')}</h5>
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-start gap-3 p-3 rounded-lg bg-card border shadow-sm"
                            >
                                <div className="shrink-0 pt-1">
                                    <Utensils className="h-4 w-4 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <span className="font-medium text-foreground">
                                        {item.recipe.name}
                                    </span>
                                    {item.time && (
                                        <span className="ml-2 text-muted-foreground flex items-center gap-1">
                                            <Clock className='h-3 w-3'/> {item.time}
                                        </span>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {item.portionSize} ({item.recipe.calories} kcal)
                                    </p>
                                    {item.comment && (
                                        <p className="italic text-xs mt-1 truncate max-w-full">
                                            "{item.comment}"
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                );
            })
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <p>Add recipes to see a nutrition summary.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NutritionSummary;
