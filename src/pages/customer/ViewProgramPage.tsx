// src/pages/customer/ViewProgramPage.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { findExerciseProgramById, DetailedFitnessTask, ExerciseSet } from "@/mockdata/viewprograms/mockexerciseprograms";
import { findExerciseGuideById } from "@/mockdata/library/mockexercises";
import WorkoutHeader from "@/components/customer/viewprogram/exercise/WorkoutHeader";
import CoachMessage from "@/components/customer/viewprogram/CoachMessage";
import ExerciseCarousel from "@/components/customer/viewprogram/exercise/ExerciseCarousel";
import ExerciseDetails from "@/components/customer/viewprogram/exercise/ExerciseDetails";
import ExerciseGuide from "@/components/customer/library/exercises/ExerciseGuide";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Note: The old FitnessWorkoutView, ExerciseCard, and ExerciseSetLogger are no longer needed and can be deleted.

type CombinedWorkoutTask = DetailedFitnessTask & { type: "fitness"; programTitle?: string };

export default function ViewProgramPage() {
  const { id } = useParams<{ id: string }>();
  // State for the entire workout data, which can be modified
  const [workoutData, setWorkoutData] = useState<DetailedFitnessTask | null>(null);
  // State to track the currently selected exercise
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const program = findExerciseProgramById(id);
      if (program) {
        setWorkoutData(program);
        // Set the first exercise as the default selected one
        if (program.exercises.length > 0) {
          setSelectedExerciseId(program.exercises[0].id);
        }
      }
    }
    setLoading(false);
  }, [id]);

  // Handler to update the state when a set is changed (e.g., kg input or checkbox)
  const handleSetChange = (exerciseId: string, setIndex: number, updatedSet: Partial<ExerciseSet>) => {
    setWorkoutData(prevData => {
      if (!prevData) return null;
      
      const newWorkoutData = { ...prevData };
      const exerciseIndex = newWorkoutData.exercises.findIndex(ex => ex.id === exerciseId);
      
      if (exerciseIndex > -1) {
        const newSets = [...newWorkoutData.exercises[exerciseIndex].sets];
        newSets[setIndex] = { ...newSets[setIndex], ...updatedSet };
        newWorkoutData.exercises[exerciseIndex] = { ...newWorkoutData.exercises[exerciseIndex], sets: newSets };
        return newWorkoutData;
      }
      return prevData;
    });
  };

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!workoutData) {
    return <div className="p-8 text-center">Workout not found.</div>;
  }

  const selectedExercise = workoutData.exercises.find(ex => ex.id === selectedExerciseId);
  const exerciseGuide = selectedExercise ? findExerciseGuideById(selectedExercise.libraryExerciseId) : null;
  
  // Prepare data for the header
  const headerTask = {
    ...workoutData,
    type: "fitness",
    programTitle: "Your Program", // Add logic to get program title if needed
    content: workoutData.exercises, // WorkoutHeader expects a 'content' prop
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-5xl mx-auto px-4">
      <div className="flex-1 overflow-auto space-y-8 py-8">
        <WorkoutHeader task={headerTask} />
        <CoachMessage />
        
        <main className="space-y-8 pb-20">
          <ExerciseCarousel
            exercises={workoutData.exercises}
            selectedExerciseId={selectedExerciseId!}
            onSelectExercise={setSelectedExerciseId}
          />

          {selectedExercise && (
            <ExerciseDetails
              exercise={selectedExercise}
              onSetChange={(setIndex, updatedValues) =>
                handleSetChange(selectedExercise.id, setIndex, updatedValues)
              }
            />
          )}

          {exerciseGuide && <ExerciseGuide guide={exerciseGuide} />}
        </main>
      </div>

      <div className="sticky bottom-4 z-50 flex w-full justify-center px-0">
        <Button size="lg" className="h-12 w-full max-w-md rounded-xl font-bold shadow-lg">
          Complete Workout
        </Button>
      </div>
    </div>
  );
}
