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
    <div className="relative w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      <WorkoutHeader task={workoutData} />
      <CoachMessage />
      <main>
        {workoutData.type === "fitness" ? (
          <FitnessWorkoutView task={workoutData} />
        ) : (
          <div className="p-8 text-center">This workout type is not yet supported.</div>
        )}
      </main>

      {/* ✅ SINGLE FIXED BUTTON */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 py-3 bg-white/90 backdrop-blur-sm border-t z-10">
        <Button size="lg" className="w-full h-12 font-bold rounded-xl shadow-lg">
          Complete Workout
        </Button>
      </div>
    </div>
  );
}
