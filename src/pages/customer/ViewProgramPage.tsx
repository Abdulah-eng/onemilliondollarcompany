// src/pages/customer/ViewProgramPage.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { findProgramByIdAndType, ProgramData } from "@/mockdata/viewprograms/programFinder";
import { DetailedFitnessTask } from "@/mockdata/viewprograms/mockexerciseprograms";
import { DetailedNutritionTask } from "@/mockdata/viewprograms/mocknutritionprograms";

import WorkoutHeader from "@/components/customer/viewprogram/exercise/WorkoutHeader";
import CoachMessage from "@/components/customer/viewprogram/CoachMessage";
import FitnessProgramView from "@/components/customer/viewprogram/exercise/FitnessProgramView";
import NutritionProgramView from "@/components/customer/viewprogram/nutrition/NutritionProgramView";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Helper components for rendering
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

const NotFound = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-2xl font-bold">Program not found</h1>
      <p className="text-muted-foreground">The requested program could not be found.</p>
    </div>
  </div>
);


export default function ViewProgramPage() {
  // Get both type and id from the URL
  const { type, id } = useParams<{ type: string; id: string }>();
  const [programData, setProgramData] = useState<ProgramData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && type) {
      const program = findProgramByIdAndType(type, id);
      if (program) {
        setProgramData(program);
      }
    }
    setLoading(false);
  }, [id, type]);

  const renderProgramView = () => {
    if (!programData) return null;

    switch (programData.type) {
      case 'fitness':
        return <FitnessProgramView initialData={programData as DetailedFitnessTask} />;
      case 'nutrition':
        return <NutritionProgramView nutritionData={programData as DetailedNutritionTask} />;
      // Add case for 'mental-health' in the future
      default:
        return <p>Unsupported program type.</p>;
    }
  };
  
  if (loading) return <LoadingSpinner />;
  if (!programData) return <NotFound />;

  // Prepare a generic header task object
  const getHeaderTask = () => {
      let content = [];
      let duration = 'N/A';
      let equipment: string[] = [];
      let stats = {};

      if (programData.type === 'fitness') {
          const fitnessData = programData as DetailedFitnessTask;
          content = fitnessData.exercises;
          duration = fitnessData.duration || 'N/A';
          equipment = fitnessData.equipment || ['Bodyweight'];
          stats = {
              Exercises: content.length,
              Duration: duration,
              Equipment: equipment.join(', '),
          };
      } else if (programData.type === 'nutrition') {
          const nutritionData = programData as DetailedNutritionTask;
          content = nutritionData.meals;
          stats = {
              Meals: content.length,
              Calories: nutritionData.totalCalories,
              Protein: `${nutritionData.totalProtein}g`,
          };
      }
      
      return {
          ...programData,
          type: programData.type,
          programTitle: "Your Program", // This can be made dynamic later
          content,
          stats, // Pass a generic stats object to the header
      };
  };

  const headerTask = getHeaderTask();

  return (
    <div className="flex flex-col min-h-screen w-full max-w-5xl mx-auto px-4">
      <div className="flex-1 overflow-auto space-y-8 py-8">
        {/* The header is now generic and can be adapted */}
        <WorkoutHeader task={headerTask} />
        <CoachMessage message={programData.coachNotes} />
        {renderProgramView()}
      </div>

      <div className="sticky bottom-4 z-50 flex w-full justify-center px-0">
        <Button size="lg" className="h-12 w-full max-w-md rounded-xl font-bold shadow-lg">
          {programData.type === 'fitness' ? 'Complete Workout' : 'Complete Day'}
        </Button>
      </div>
    </div>
  );
}
