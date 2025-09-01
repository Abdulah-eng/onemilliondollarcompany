// src/components/customer/viewprogram/nutrition/NutritionProgramView.tsx

import { useState, useEffect } from "react";
import { DetailedNutritionTask } from "@/mockdata/viewprograms/mocknutritionprograms";
import MealCarousel from "./MealCarousel";
import InteractiveRecipeView from "./InteractiveRecipeView";
import GuideDrawer from "../shared/GuideDrawer"; // ✅ IMPORT THE GENERIC DRAWER
import RecipeDetails from "@/components/customer/library/recipe/RecipeDetails";

interface NutritionProgramViewProps {
  nutritionData: DetailedNutritionTask;
}

export default function NutritionProgramView({ nutritionData }: NutritionProgramViewProps) {
  const [selectedMealId, setSelectedMealId] = useState<string | null>(
    nutritionData.meals.length > 0 ? nutritionData.meals[0].id : null
  );
  // ✅ ADD STATE TO DETECT MOBILE/TABLET
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectedMeal = nutritionData.meals.find(m => m.id === selectedMealId);
  const selectedRecipe = selectedMeal?.recipe;

  return (
    <main className="w-full space-y-10">
      <MealCarousel
        meals={nutritionData.meals}
        selectedMealId={selectedMealId!}
        onSelectMeal={setSelectedMealId}
      />
      
      {/* ✅ Use the generic GuideDrawer for the recipe details */}
      <GuideDrawer
        guideData={selectedRecipe}
        isMobile={isMobile}
        triggerText="View Recipe:"
      >
        {/* We use RecipeDetails here as it's the library component */}
        {selectedRecipe && <RecipeDetails recipe={selectedRecipe} />}
      </GuideDrawer>
    </main>
  );
}
