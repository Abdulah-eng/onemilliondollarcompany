// src/pages/customer/ViewProgramPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { generateDailySchedule, ScheduledTask, mockPrograms } from "@/mockdata/programs/mockprograms";
import { findExerciseProgramById, DetailedFitnessTask } from "@/mockdata/viewprograms/mockexerciseprograms";

// ✅ CORRECTED IMPORT PATHS for the moved components
import FitnessWorkoutView from "@/components/customer/viewprogram/exercise/FitnessWorkoutView";
import WorkoutHeader from "@/components/customer/viewprogram/exercise/WorkoutHeader";
import CoachMessage from "@/components/customer/viewprogram/CoachMessage";
import { Loader2 } from "lucide-react";

type CombinedWorkoutTask = Omit<ScheduledTask, 'content'> & DetailedFitnessTask;

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
      const combinedData: CombinedWorkoutTask = {
        ...detailedTaskInfo,
        type: 'fitness',
        programTitle: '',
        status: 'pending',
        progress: 0,
        date: new Date(),
        programId: '',
        weekNumber: 1,
      };
      setWorkoutData(combinedData);
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
