// src/components/customer/viewprogram/nutrition/NutritionProgramView.tsx

import { useState } from "react";
import { DetailedNutritionTask } from "@/mockdata/viewprograms/mocknutritionprograms";
import MealCarousel from "./MealCarousel";
import RecipeDetails from "@/components/customer/library/recipe/RecipeDetails";

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
      {selectedMeal && selectedMeal.recipe && <RecipeDetails recipe={selectedMeal.recipe} />}
    </main>
  );
}
