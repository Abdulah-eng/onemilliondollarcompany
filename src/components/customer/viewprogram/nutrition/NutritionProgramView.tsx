// src/components/customer/viewprogram/nutrition/NutritionProgramView.tsx

import { useState } from "react";
import { DetailedNutritionTask } from "@/mockdata/viewprograms/mocknutritionprograms";
import MealCarousel from "./MealCarousel";
import InteractiveRecipeView from "./InteractiveRecipeView";

interface NutritionProgramViewProps {
  nutritionData: DetailedNutritionTask;
}

export default function NutritionProgramView({ nutritionData }: NutritionProgramViewProps) {
  const [selectedMealId, setSelectedMealId] = useState<string | null>(
    nutritionData.meals.length > 0 ? nutritionData.meals[0].id : null
  );

  const selectedMeal = nutritionData.meals.find(m => m.id === selectedMealId);

  return (
    <main className="space-y-8 pb-20">
      <MealCarousel
        meals={nutritionData.meals}
        selectedMealId={selectedMealId!}
        onSelectMeal={setSelectedMealId}
      />
      
      {/* ✅ REMOVED the wrapper div with px-4 to allow full-width display */}
      {selectedMeal && selectedMeal.recipe && (
        <InteractiveRecipeView recipe={selectedMeal.recipe} />
      )}
    </main>
  );
}
