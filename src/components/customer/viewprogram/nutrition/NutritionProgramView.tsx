// src/components/customer/viewprogram/nutrition/NutritionProgramView.tsx

import { useState, useRef, useEffect } from "react";
import { DetailedNutritionTask } from "@/mockdata/viewprograms/mocknutritionprograms";
import MealCarousel from "./MealCarousel";
import InteractiveRecipeView from "./InteractiveRecipeView";

interface NutritionProgramViewProps {
  nutritionData: DetailedNutritionTask;
  onRecipeVisibilityChange: (isVisible: boolean) => void; // ✅ ADDED PROP
}

export default function NutritionProgramView({ nutritionData, onRecipeVisibilityChange }: NutritionProgramViewProps) {
  const [selectedMealId, setSelectedMealId] = useState<string | null>(
    nutritionData.meals.length > 0 ? nutritionData.meals[0].id : null
  );
  // ✅ REF to attach to the recipe container element
  const recipeRef = useRef<HTMLDivElement>(null);

  const selectedMeal = nutritionData.meals.find(m => m.id === selectedMealId);

  // ✅ EFFECT to observe the recipe container
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Call the function passed from the parent with the visibility status
        onRecipeVisibilityChange(entry.isIntersecting);
      },
      { 
        // We can add a rootMargin to trigger a bit before it's fully off-screen
        rootMargin: '0px 0px -100px 0px', // Triggers when bottom 100px is off-screen
        threshold: 0 
      }
    );

    const currentRef = recipeRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [onRecipeVisibilityChange, selectedMealId]); // Re-observe if the meal changes

  return (
    <main className="w-full space-y-10 pb-20">
      <MealCarousel
        meals={nutritionData.meals}
        selectedMealId={selectedMealId!}
        onSelectMeal={setSelectedMealId}
      />
      
      {/* ✅ Attach the ref to this container */}
      <div ref={recipeRef}>
        {selectedMeal && selectedMeal.recipe && (
          <InteractiveRecipeView recipe={selectedMeal.recipe} />
        )}
      </div>
    </main>
  );
}
