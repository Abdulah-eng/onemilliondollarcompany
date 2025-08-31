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
    <main className="w-full space-y-10 pb-20">
      <MealCarousel
        meals={nutritionData.meals}
        selectedMealId={selectedMealId!}
        onSelectMeal={setSelectedMealId}
      />
      
      {selectedMeal && selectedMeal.recipe && (
        <InteractiveRecipeView recipe={selectedMeal.recipe} />
      )}
    </main>
  );
}
