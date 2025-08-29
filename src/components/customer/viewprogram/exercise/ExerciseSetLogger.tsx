// src/components/customer/viewprogram/exercise/ExerciseSetLogger.tsx
import { FitnessExercise, ExerciseSet } from "@/mockdata/viewprograms/mockexerciseprograms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseSetLoggerProps {
  exerciseData: FitnessExercise;
  setExerciseData: React.Dispatch<React.SetStateAction<FitnessExercise>>;
}

export function ExerciseSetLogger({ exerciseData, setExerciseData }: ExerciseSetLoggerProps) {
  const sets = exerciseData.sets || [];
  
  const handleSetChange = (setId: number, field: "reps" | "weight", value: string) => {
    const updatedSets = sets.map((set) =>
      set.id === setId ? { ...set, [field]: value === "" ? null : Number(value) } : set
    );
    setExerciseData({ ...exerciseData, sets: updatedSets });
  };

  const toggleSetCompletion = (setId: number) => {
    const updatedSets = sets.map((set) =>
      set.id === setId ? { ...set, isCompleted: !set.isCompleted } : set
    );
    setExerciseData({ ...exerciseData, sets: updatedSets });
  };

  const addSet = () => {
    const newSet: ExerciseSet = {
      id: (sets.at(-1)?.id || 0) + 1,
      reps: null,
      weight: null,
      isCompleted: false,
    };
    setExerciseData({ ...exerciseData, sets: [...sets, newSet] });
  };

  const removeSet = (setId: number) => {
    const updatedSets = sets.filter((set) => set.id !== setId);
    setExerciseData({ ...exerciseData, sets: updatedSets });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-12 gap-2 items-center px-2 font-medium text-xs text-slate-400 uppercase tracking-wider">
        <div className="col-span-2 text-center">Set</div>
        <div className="col-span-4 text-center">Weight (kg)</div>
        <div className="col-span-4 text-center">Reps</div>
        <div className="col-span-2 text-center">Done</div>
      </div>

      {sets.map((set, index) => (
        <div
          key={set.id}
          className={cn(
            "grid grid-cols-12 gap-2 items-center p-2 rounded-lg transition-colors",
            set.isCompleted ? "bg-green-50" : "bg-transparent"
          )}
        >
          <div className="col-span-2 flex justify-center items-center">
            <span className="font-bold text-slate-600 bg-slate-100 h-9 w-9 flex items-center justify-center rounded-full">
              {index + 1}
            </span>
          </div>
          <Input
            type="number"
            placeholder="-"
            className="col-span-4 text-center h-11 bg-slate-100 border-transparent focus-visible:ring-primary"
            value={set.weight ?? ""}
            onChange={(e) => handleSetChange(set.id, "weight", e.target.value)}
          />
          <Input
            type="number"
            placeholder="-"
            className="col-span-4 text-center h-11 bg-slate-100 border-transparent focus-visible:ring-primary"
            value={set.reps ?? ""}
            onChange={(e) => handleSetChange(set.id, "reps", e.target.value)}
          />
          <div className="col-span-2 flex items-center justify-center">
            <Checkbox
              checked={set.isCompleted}
              onCheckedChange={() => toggleSetCompletion(set.id)}
              className="h-6 w-6 rounded-md"
            />
            {sets.length > 1 && (
              <button
                onClick={() => removeSet(set.id)}
                className="ml-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}

      <Button onClick={addSet} variant="outline" className="w-full h-11 mt-2 rounded-lg text-slate-600 hover:text-primary hover:border-primary/50">
        <Plus className="w-4 h-4 mr-2" />
        Add Set
      </Button>
    </div>
  );
}
