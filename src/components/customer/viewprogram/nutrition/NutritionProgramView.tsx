// src/components/customer/viewprogram/nutrition/NutritionProgramView.tsx

import { useState, useEffect } from "react";
import { DetailedNutritionTask } from "@/mockdata/viewprograms/mocknutritionprograms";
import MealCarousel from "./MealCarousel";
import GuideDrawer from "../shared/GuideDrawer";
import RecipeDetails from "@/components/customer/library/recipe/RecipeDetails";

interface NutritionProgramViewProps {
  nutritionData: DetailedNutritionTask;
}

export default function NutritionProgramView({ nutritionData }: NutritionProgramViewProps) {
  const [selectedMealId, setSelectedMealId] = useState<string | null>(
    nutritionData.meals.length > 0 ? nutritionData.meals[0].id : null
  );
  // ✅ Corrected breakpoint for iPad and smaller devices
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectedMeal = nutritionData.meals.find(m => m.id === selectedMealId);
  const selectedRecipe = selectedMeal?.recipe;

  return (
    // ✅ Re-added bottom padding to ensure scroll space for the trigger
    <main className="w-full space-y-10 pb-20">
      <MealCarousel
        meals={nutritionData.meals}
        selectedMealId={selectedMealId!}
        onSelectMeal={setSelectedMealId}
      />
      
      <GuideDrawer
        guideData={selectedRecipe}
        isMobile={isMobile}
        triggerText="View Recipe:"
      >
        {selectedRecipe && <RecipeDetails recipe={selectedRecipe} />}
      </GuideDrawer>
    </main>
  );
}
