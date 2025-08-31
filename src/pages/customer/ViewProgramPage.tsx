// src/pages/customer/ViewProgramPage.tsx

import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { findProgramByIdAndType, ProgramData } from "@/mockdata/viewprograms/programFinder";

// Import all necessary data types
import { DetailedFitnessTask } from "@/mockdata/viewprograms/mockexerciseprograms";
import { DetailedNutritionTask } from "@/mockdata/viewprograms/mocknutritionprograms";
import { DetailedMentalHealthTask } from "@/mockdata/viewprograms/mockmentalhealthprograms";

// Import all specialized headers
import WorkoutHeader from "@/components/customer/viewprogram/exercise/WorkoutHeader";
import NutritionHeader from "@/components/customer/viewprogram/nutrition/NutritionHeader";
import MentalHealthHeader from "@/components/customer/viewprogram/mentalhealth/MentalHealthHeader";

// Import all view components
import CoachMessage from "@/components/customer/viewprogram/CoachMessage";
import FitnessProgramView from "@/components/customer/viewprogram/exercise/FitnessProgramView";
import NutritionProgramView from "@/components/customer/viewprogram/nutrition/NutritionProgramView";
import MentalHealthProgramView from "@/components/customer/viewprogram/mentalhealth/MentalHealthProgramView";

import { Loader2, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


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

// ✅ NEW COMPONENT: The "peeky" drawer for the recipe
const RecipePeekDrawer = ({ task, isVisible }: { task: DetailedNutritionTask, isVisible: boolean }) => {
    if (!task.meals?.[0]?.recipe) return null;
    
    return (
        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-40 md:hidden bg-card border-t border-border p-4 transition-transform duration-300 ease-in-out",
            isVisible ? "translate-y-0" : "translate-y-full"
        )}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Up Next</p>
                    <h3 className="text-lg font-bold">{task.meals[0].recipe.name}</h3>
                </div>
                <div className="flex flex-col items-center text-primary">
                    <ChevronUp className="h-5 w-5"/>
                    <span className="text-xs font-bold">Scroll</span>
                </div>
            </div>
        </div>
    );
};

export default function ViewProgramPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [programData, setProgramData] = useState<ProgramData | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrollTop, setScrollTop] = useState(0); // ✅ State to track scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null); // ✅ Ref for the scrollable element

  useEffect(() => {
    setLoading(true);
    if (id && type) {
      const program = findProgramByIdAndType(type, id);
      setProgramData(program || null);
    }
    setLoading(false);
  }, [id, type]);

  // ✅ Effect to handle scroll events
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
        setScrollTop(container.scrollTop);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [programData]); // Rerun if programData changes

  const isAtTop = scrollTop < 50; // ✅ Determine if we are at the top

  const renderProgramHeader = () => {
    if (!programData) return null;
    switch (programData.type) {
      case 'fitness': return <WorkoutHeader task={programData as DetailedFitnessTask} />;
      case 'nutrition': return <NutritionHeader task={programData as DetailedNutritionTask} />;
      case 'mental': return <MentalHealthHeader task={programData as DetailedMentalHealthTask} />;
      default: return null;
    }
  };

  const renderProgramView = () => {
    if (!programData) return null;
    switch (programData.type) {
      case 'fitness':
        return <FitnessProgramView initialData={programData as DetailedFitnessTask} />;
      case 'nutrition':
        // ✅ Pass down a prop to hide the main view when the peek drawer is showing
        return <NutritionProgramView nutritionData={programData as DetailedNutritionTask} showMainView={!isAtTop} />;
      case 'mental':
        return <MentalHealthProgramView initialData={programData as DetailedMentalHealthTask} />;
      default:
        return <p>Unsupported program type.</p>;
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!programData) return <NotFound />;
  
  const getButtonText = () => {
    switch (programData.type) {
        case 'fitness': return 'Complete Workout';
        case 'nutrition': return 'Complete Day';
        case 'mental': return 'Complete Session';
        default: return 'Complete';
    }
  }

  return (
    <div className="flex flex-col min-h-screen w-full max-w-5xl mx-auto md:px-4">
      {/* ✅ Added ref to the scrollable container */}
      <div ref={scrollContainerRef} className="flex-1 overflow-auto space-y-8 py-8">
        {renderProgramHeader()}
        <CoachMessage message={programData.coachNotes} />
        {renderProgramView()}
      </div>

      <div className="sticky bottom-4 z-50 flex w-full justify-center px-4 md:px-0">
        <Button size="lg" className="h-12 w-full max-w-md rounded-xl font-bold shadow-lg">
          {getButtonText()}
        </Button>
      </div>

      {/* ✅ Conditionally render the peek drawer ONLY for nutrition programs */}
      {programData.type === 'nutrition' && (
          <RecipePeekDrawer task={programData as DetailedNutritionTask} isVisible={isAtTop} />
      )}
    </div>
  );
}
