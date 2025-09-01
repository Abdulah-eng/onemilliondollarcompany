// src/pages/customer/ViewProgramPage.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { findProgramByIdAndType, ProgramData } from "@/mockdata/viewprograms/programFinder";

// ✅ Import all necessary data types
import { DetailedFitnessTask } from "@/mockdata/viewprograms/mockexerciseprograms";
import { DetailedNutritionTask } from "@/mockdata/viewprograms/mocknutritionprograms";
import { DetailedMentalHealthTask } from "@/mockdata/viewprograms/mockmentalhealthprograms";

// ✅ Import all specialized headers
import WorkoutHeader from "@/components/customer/viewprogram/exercise/WorkoutHeader";
import NutritionHeader from "@/components/customer/viewprogram/nutrition/NutritionHeader";
import MentalHealthHeader from "@/components/customer/viewprogram/mentalhealth/MentalHealthHeader";

// ✅ Import all view components
import CoachMessage from "@/components/customer/viewprogram/CoachMessage";
import FitnessProgramView from "@/components/customer/viewprogram/exercise/FitnessProgramView";
import NutritionProgramView from "@/components/customer/viewprogram/nutrition/NutritionProgramView";
import MentalHealthProgramView from "@/components/customer/viewprogram/mentalhealth/MentalHealthProgramView";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Helper components remain the same
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
  const { type, id } = useParams<{ type: string; id: string }>();
  const [programData, setProgramData] = useState<ProgramData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (id && type) {
      const program = findProgramByIdAndType(type, id);
      setProgramData(program || null);
    }
    setLoading(false);
  }, [id, type]);

  // ✅ Renders the correct specialized header based on program type
  const renderProgramHeader = () => {
    if (!programData) return null;
    switch (programData.type) {
      case 'fitness':
        return <WorkoutHeader task={programData as DetailedFitnessTask} />;
      case 'nutrition':
        return <NutritionHeader task={programData as DetailedNutritionTask} />;
      case 'mental':
        return <MentalHealthHeader task={programData as DetailedMentalHealthTask} />;
      default:
        return null;
    }
  };

  // ✅ Renders the correct program content view
  const renderProgramView = () => {
    if (!programData) return null;
    switch (programData.type) {
      case 'fitness':
        return <FitnessProgramView initialData={programData as DetailedFitnessTask} />;
      case 'nutrition':
        return <NutritionProgramView nutritionData={programData as DetailedNutritionTask} />;
      case 'mental':
        return <MentalHealthProgramView initialData={programData as DetailedMentalHealthTask} />;
      default:
        return <p>Unsupported program type.</p>;
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!programData) return <NotFound />;
  
  // ✅ Gets the correct button text for the program type
  const getButtonText = () => {
    switch (programData.type) {
        case 'fitness': return 'Complete Workout';
        case 'nutrition': return 'Complete Day';
        case 'mental': return 'Complete Session';
        default: return 'Complete';
    }
  }

  return (
    <div className="flex flex-col min-h-screen w-full max-w-5xl mx-auto px-4">
      <div className="flex-1 overflow-auto space-y-8 py-8" data-guide-scroll="true">
        {/* ✅ Renders the appropriate header */}
        {renderProgramHeader()}
        <CoachMessage message={programData.coachNotes} />
        {renderProgramView()}
      </div>

      <div className="sticky bottom-4 z-50 flex w-full justify-center px-0">
        <Button size="lg" className="h-12 w-full max-w-md rounded-xl font-bold shadow-lg">
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
}
