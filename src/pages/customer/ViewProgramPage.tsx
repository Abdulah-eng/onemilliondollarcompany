import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { findExerciseProgramById, DetailedFitnessTask } from "@/mockdata/viewprograms/mockexerciseprograms";
import FitnessWorkoutView from "@/components/customer/viewprogram/exercise/FitnessWorkoutView";
import WorkoutHeader from "@/components/customer/viewprogram/exercise/WorkoutHeader";
import CoachMessage from "@/components/customer/viewprogram/CoachMessage";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type CombinedWorkoutTask = DetailedFitnessTask & { type: "fitness"; programTitle?: string };

export default function ViewProgramPage() {
  const { id } = useParams<{ id: string }>();
  const [workoutData, setWorkoutData] = useState<CombinedWorkoutTask | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const detailedTaskInfo = findExerciseProgramById(id);
    if (detailedTaskInfo) {
      setWorkoutData({ ...detailedTaskInfo, type: "fitness", programTitle: "" });
    }

    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!workoutData) {
    return <div className="text-center p-8">Workout not found.</div>;
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4">
      {/* Use flex-col + min-h-screen to allow content + fixed button */}
      <div className="flex flex-col min-h-screen">
        {/* Scrollable content */}
        <div className="flex-1 overflow-auto space-y-8 py-8">
          <WorkoutHeader task={workoutData} />
          <CoachMessage />
          <main className="space-y-8 pb-28"> {/* pb = fixed button height + spacing */}
            {workoutData.type === "fitness" ? (
              <FitnessWorkoutView task={workoutData} />
            ) : (
              <div className="p-8 text-center">This workout type is not yet supported.</div>
            )}
          </main>
        </div>

        {/* Fixed Complete Workout button */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 py-3 bg-white/90 backdrop-blur-sm border-t z-50">
          <Button size="lg" className="w-full h-12 font-bold rounded-xl shadow-lg">
            Complete Workout
          </Button>
        </div>
      </div>
    </div>
  );
}
