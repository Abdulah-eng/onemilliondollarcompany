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

export default function ViewProgramPage() {
  const { id } = useParams<{ id: string }>();
  const [workoutData, setWorkoutData] = useState<DetailedFitnessTask | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const program = findExerciseProgramById(id);
      if (program) {
        setWorkoutData(program);
        if (program.exercises.length > 0) {
          setSelectedExerciseId(program.exercises[0].id);
        }
      }
    }
    setLoading(false);
  }, [id]);

  const handleSetChange = (exerciseId: string, setIndex: number, updatedSet: Partial<ExerciseSet>) => {
    setWorkoutData(prevData => {
      if (!prevData) return null;
      const newWorkoutData = JSON.parse(JSON.stringify(prevData));
      const exerciseToUpdate = newWorkoutData.exercises.find((ex: { id: string; }) => ex.id === exerciseId);
      if (exerciseToUpdate) {
        Object.assign(exerciseToUpdate.sets[setIndex], updatedSet);
      }
      return newWorkoutData;
    });
  };

  const handleAddSet = (exerciseId: string) => {
    setWorkoutData(prevData => {
      if (!prevData) return null;
      const newWorkoutData = JSON.parse(JSON.stringify(prevData));
      const exerciseToUpdate = newWorkoutData.exercises.find((ex: { id: string; }) => ex.id === exerciseId);
      if (exerciseToUpdate) {
        const lastSet = exerciseToUpdate.sets[exerciseToUpdate.sets.length - 1];
        const newSet: ExerciseSet = {
          targetReps: lastSet?.targetReps || "8-12",
          performedKg: null,
          performedReps: null,
          completed: false,
          previous: "New set",
        };
        exerciseToUpdate.sets.push(newSet);
      }
      return newWorkoutData;
    });
  };

  // ✅ Handles removing a set from an exercise.
  const handleRemoveSet = (exerciseId: string, setIndex: number) => {
    setWorkoutData(prevData => {
      if (!prevData) return null;
      const newWorkoutData = JSON.parse(JSON.stringify(prevData));
      const exerciseToUpdate = newWorkoutData.exercises.find((ex: { id: string; }) => ex.id === exerciseId);

      // We only allow removal if there's more than one set
      if (exerciseToUpdate && exerciseToUpdate.sets.length > 1) {
        exerciseToUpdate.sets.splice(setIndex, 1);
      }
      
      return newWorkoutData;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!workoutData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Workout not found</h1>
          <p className="text-muted-foreground">The requested workout could not be found.</p>
        </div>
      </div>
    );
  }

  const selectedExercise = workoutData.exercises.find(ex => ex.id === selectedExerciseId);
  const exerciseGuide = selectedExercise ? findExerciseGuideById(selectedExercise.libraryExerciseId) : null;
  
  const headerTask = {
    ...workoutData,
    type: "fitness",
    programTitle: "Your Program",
    content: workoutData.exercises,
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
              onAddSet={() => handleAddSet(selectedExercise.id)}
              // ✅ Pass the new handler down to the component
              onRemoveSet={(setIndex) => handleRemoveSet(selectedExercise.id, setIndex)}
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
