// src/components/customer/viewprogram/nutrition/DailyNutritionView.tsx

import { DetailedNutritionTask } from "@/mockdata/viewprograms/mocknutritionprograms";
import CoachMessage from "@/components/customer/viewprogram/CoachMessage";
import MealCard from "./MealCard";
import ProgramHeader from "../ProgramHeader"; // We'll create this next

export default function DailyNutritionView({ program }: { program: DetailedNutritionTask }) {
  return (
    <div className="space-y-8">
      <ProgramHeader task={program} type="nutrition" />
      <CoachMessage notes={program.coachNotes} />
      
      <main className="space-y-6 pb-20">
        <h2 className="text-2xl font-bold tracking-tight">Today's Meals</h2>
        <div className="space-y-6">
          {program.meals.map(meal => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      </main>
    </div>
  );
}
