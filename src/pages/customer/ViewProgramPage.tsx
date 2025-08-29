import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { generateDailySchedule, ScheduledTask, mockPrograms } from "@/mockdata/programs/mockprograms";
import { findExerciseProgramById, DetailedFitnessTask } from "@/mockdata/viewprograms/mockexerciseprograms";

import FitnessWorkoutView from "@/components/customer/viewprogram/exercise/FitnessWorkoutView";
import WorkoutHeader from "@/components/customer/viewprogram/exercise/WorkoutHeader";
import CoachMessage from "@/components/customer/viewprogram/CoachMessage";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type CombinedWorkoutTask = Omit<ScheduledTask, 'content'> & DetailedFitnessTask;

export default function ViewProgramPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const [workoutData, setWorkoutData] = useState<CombinedWorkoutTask | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) {
      setLoading(false);
      return;
    }
    const schedule = generateDailySchedule(mockPrograms);
    const basicTaskInfo = schedule.find((t) => t.id === taskId);
    const detailedTaskInfo = findExerciseProgramById(taskId);
    
    if (basicTaskInfo && detailedTaskInfo) {
      setWorkoutData({ ...basicTaskInfo, ...detailedTaskInfo });
    }
    setLoading(false);
  }, [taskId]);

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
    // ✅ 1. THE LAYOUT IS NOW CONTROLLED HERE.
    // This container fills the space provided by AppShell's <main> tag.
    <div className="relative h-full">
      
      {/* 2. All content is now in a scrollable div. */}
      {/* We add bottom padding (pb-24) to prevent the last card from being hidden by the button. */}
      <div className="h-full overflow-y-auto pb-24">
        <div className="mx-auto max-w-5xl space-y-8">
            <WorkoutHeader task={workoutData} />
            <CoachMessage />
            <main>
              <FitnessWorkoutView task={workoutData} />
            </main>
        </div>
      </div>

      {/* 3. THIS IS THE NEW BUTTON CONTAINER */}
      {/* It's positioned 'absolute' to the parent div, NOT 'fixed' to the window. */}
      {/* This ensures it stays within the main content area and NEVER overlaps the sidebar. */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="mx-auto max-w-5xl border-t bg-white/80 px-4 py-3 backdrop-blur-sm">
          <Button size="lg" className="h-12 w-full rounded-xl font-bold shadow-lg">
            Complete Workout
          </Button>
        </div>
      </div>
    </div>
  );
}
