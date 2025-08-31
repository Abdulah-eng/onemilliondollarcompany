// src/components/customer/viewprogram/nutrition/NutritionProgramView.tsx

import { useState } from "react";
import { DetailedNutritionTask } from "@/mockdata/viewprograms/mocknutritionprograms";
import MealCarousel from "./MealCarousel";
import InteractiveRecipeView from "./InteractiveRecipeView";
import { cn } from "@/lib/utils";

interface NutritionProgramViewProps {
  nutritionData: DetailedNutritionTask;
  showMainView: boolean; // ✅ ADDED PROP
}

export default function NutritionProgramView({ nutritionData, showMainView }: NutritionProgramViewProps) {
  const [selectedMealId, setSelectedMealId] = useState<string | null>(
    nutritionData.meals.length > 0 ? nutritionData.meals[0].id : null
  );

  const selectedMeal = nutritionData.meals.find(m => m.id === selectedMealId);

  return (
    <main className="w-full space-y-10 pb-20">
      <MealCarousel
        meals={nutritionData.meals}
        selectedMealId={selectedMealId!}
        onSelectMeal={setSelectedMealId}
      />
      
      {/* ✅ Conditionally hide the view if the peek drawer is visible on mobile */}
      <div className={cn("transition-opacity duration-300", !showMainView && "invisible md:visible")}>
        {selectedMeal && selectedMeal.recipe && (
          <InteractiveRecipeView recipe={selectedMeal.recipe} />
        )}
      </div>
    </main>
  );
}
