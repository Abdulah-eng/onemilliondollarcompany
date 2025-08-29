import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// ✅ 1. IMPORT FROM BOTH MOCK FILES
import { generateDailySchedule, ScheduledTask } from "@/mockdata/programs/mockprograms";
import { findExerciseProgramById, DetailedFitnessTask } from "@/mockdata/viewprograms/mockexerciseprograms";

// Import components
import FitnessWorkoutView from "@/components/customer/viewprogram/FitnessWorkoutView";
import WorkoutHeader from "@/components/customer/viewprogram/WorkoutHeader";
import CoachMessage from "@/components/customer/viewprogram/CoachMessage";
import { Loader2 } from "lucide-react";

// ✅ 2. CREATE A NEW TYPE FOR THE COMBINED DATA
// This will hold all the information we need for the page.
type CombinedWorkoutTask = ScheduledTask & DetailedFitnessTask;

export default function ViewProgramPage() {
  const { taskId } = useParams<{ taskId: string }>();
  // ✅ 3. USE STATE TO HOLD OUR COMBINED WORKOUT DATA
  const [workoutData, setWorkoutData] = useState<CombinedWorkoutTask | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) {
      setLoading(false);
      return;
    }

    // Step A: Find the high-level task details (for programTitle, status, etc.)
    const schedule = generateDailySchedule();
    const basicTaskInfo = schedule.find((t) => t.id === taskId);

    // Step B: Find the detailed fitness program data (for exercises, duration, etc.)
    const detailedTaskInfo = findExerciseProgramById(taskId);
    
    // Step C: If both are found, combine them
    if (basicTaskInfo && detailedTaskInfo) {
      const combinedData: CombinedWorkoutTask = {
        ...basicTaskInfo, // Spread the basic info first
        ...detailedTaskInfo, // Spread the detailed info, overwriting title/content
      };
      setWorkoutData(combinedData);
    }
    
    setLoading(false);
  }, [taskId]);

  // Loading state
  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not found state
  if (!workoutData) {
    return <div className="text-center p-8">Workout not found.</div>;
  }
  
  // ✅ 4. RENDER COMPONENTS WITH THE COMBINED DATA
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      <WorkoutHeader task={workoutData} />
      <CoachMessage />
      <main>
        {workoutData.type === "fitness" ? (
          <FitnessWorkoutView task={workoutData} />
        ) : (
          <div className="p-8 text-center">This workout type is not yet supported.</div>
        )}
      </main>
    </div>
  );
}
