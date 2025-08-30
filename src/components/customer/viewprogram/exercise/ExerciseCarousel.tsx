// src/components/customer/viewprogram/exercise/ExerciseCarousel.tsx

import { WorkoutExercise } from "@/mockdata/viewprograms/mockexerciseprograms";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface ExerciseCarouselProps {
  exercises: WorkoutExercise[];
  selectedExerciseId: string;
  onSelectExercise: (id: string) => void;
}

export default function ExerciseCarousel({ exercises, selectedExerciseId, onSelectExercise }: ExerciseCarouselProps) {
  return (
    <div className="relative">
      <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
        {exercises.map((exercise) => {
          const isSelected = exercise.id === selectedExerciseId;
          const isCompleted = exercise.sets.every(set => set.completed);

          return (
            <button
              key={exercise.id}
              onClick={() => onSelectExercise(exercise.id)}
              className={cn(
                "relative flex-shrink-0 w-28 h-28 rounded-xl p-2 flex flex-col items-center justify-center text-center transition-all duration-200 border-2",
                isSelected ? "bg-primary/10 border-primary" : "bg-card border-transparent hover:border-primary/50"
              )}
            >
              {isCompleted && (
                <CheckCircle2 className="absolute top-1.5 right-1.5 h-5 w-5 text-green-500 fill-white" />
              )}
              <img src={exercise.imageUrl} alt={exercise.name} className="w-14 h-14 mb-1 object-contain" />
              <span className="text-xs font-semibold leading-tight">{exercise.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
