// src/components/customer/viewprogram/exercise/FitnessWorkoutView.tsx
import { DetailedFitnessTask, FitnessExercise } from "@/mockdata/viewprograms/mockexerciseprograms";
import { ExerciseCard } from "./ExerciseCard";
import { Button } from "@/components/ui/button";

interface FitnessWorkoutViewProps {
  task: DetailedFitnessTask;
}

export default function FitnessWorkoutView({ task }: FitnessWorkoutViewProps) {
  const exercises = task.content as FitnessExercise[];

  return (
    <div className="space-y-4 pb-24">
      {exercises.map((exercise, index) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          exerciseNumber={index + 1}
        />
      ))}

      {/* ✅ THIS IS THE FIX FOR THE BUTTON */}
      {/* Assuming a sidebar width of 16 (64px), we adjust the left position */}
      {/* 'lg:left-[calc(50%+theme(spacing.8))]' re-centers the button in the content area on large screens */}
      <div className="fixed bottom-0 left-0 lg:left-16 right-0 z-10 border-t bg-white/80 backdrop-blur-sm">
          <div className="mx-auto max-w-5xl px-4 py-3">
               <Button size="lg" className="h-12 w-full rounded-xl font-bold shadow-lg">
                    Complete Workout
               </Button>
          </div>
      </div>
    </div>
  );
}
