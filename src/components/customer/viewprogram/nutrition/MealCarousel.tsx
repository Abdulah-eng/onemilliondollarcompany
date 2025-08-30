// src/components/customer/viewprogram/nutrition/MealCarousel.tsx

import { Meal } from "@/mockdata/viewprograms/mocknutritionprograms";
import { cn } from "@/lib/utils";
import { Sunrise, Sunset, Utensils, Coffee } from "lucide-react";
import { ReactNode } from "react";

interface MealCarouselProps {
  meals: Meal[];
  selectedMealId: string;
  onSelectMeal: (id: string) => void;
}

const mealIcons: Record<string, ReactNode> = {
  Breakfast: <Sunrise className="w-8 h-8 mb-2" />,
  Lunch: <Utensils className="w-8 h-8 mb-2" />,
  Dinner: <Sunset className="w-8 h-8 mb-2" />,
  Snack: <Coffee className="w-8 h-8 mb-2" />,
};

export default function MealCarousel({ meals, selectedMealId, onSelectMeal }: MealCarouselProps) {
  return (
    <div className="relative">
      <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
        {meals.map((meal) => {
          const isSelected = meal.id === selectedMealId;
          return (
            <button
              key={meal.id}
              onClick={() => onSelectMeal(meal.id)}
              className={cn(
                "relative flex-shrink-0 w-28 h-28 rounded-xl p-2 flex flex-col items-center justify-center text-center transition-all duration-200 border-2",
                isSelected ? "bg-primary/10 border-primary" : "bg-card border-transparent hover:border-primary/50"
              )}
            >
              {mealIcons[meal.mealType]}
              <span className="text-sm font-semibold leading-tight">{meal.mealType}</span>
              <span className="text-xs text-muted-foreground leading-tight">{meal.recipe?.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
