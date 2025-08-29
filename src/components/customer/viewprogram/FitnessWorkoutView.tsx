// src/components/customer/viewprogram/FitnessWorkoutView.tsx

import { ScheduledTask, FitnessExercise } from "@/mockdata/programs/mockprograms";
import { ExerciseCard } from "./ExerciseCard";
import { Button } from "@/components/ui/button";

interface FitnessWorkoutViewProps {
  task: ScheduledTask;
}

export default function FitnessWorkoutView({ task }: FitnessWorkoutViewProps) {
  // We need to tell TypeScript that this task's content is the detailed format
  const exercises = task.content as FitnessExercise[];

  return (
    <div className="space-y-6 pb-24">
      {/* Welcome message for the program */}
      <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
        <h3 className="font-bold text-blue-800">A Message from your Coach:</h3>
        <p className="mt-1 text-blue-700">
          "Let's crush this workout! Focus on your form and give it your all. You've got this!"
        </p>
      </div>

      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            exerciseNumber={index + 1}
          />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t">
        <Button size="lg" className="w-full max-w-3xl mx-auto h-12 font-bold rounded-xl">
          Complete Workout
        </Button>
      </div>
    </div>
  );
}
