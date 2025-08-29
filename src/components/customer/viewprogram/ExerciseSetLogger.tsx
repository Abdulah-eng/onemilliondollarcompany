// src/components/customer/viewprogram/ExerciseSetLogger.tsx

import { FitnessExercise, ExerciseSet } from "@/mockdata/programs/mockprograms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus } from "lucide-react";

interface ExerciseSetLoggerProps {
  exerciseData: FitnessExercise;
  setExerciseData: React.Dispatch<React.SetStateAction<FitnessExercise>>;
}

export function ExerciseSetLogger({
  exerciseData,
  setExerciseData,
}: ExerciseSetLoggerProps) {

  const handleSetChange = (setId: number, field: "reps" | "weight", value: string) => {
    const updatedSets = exerciseData.sets.map((set) =>
      set.id === setId ? { ...set, [field]: value === "" ? null : Number(value) } : set
    );
    setExerciseData({ ...exerciseData, sets: updatedSets });
  };

  const toggleSetCompletion = (setId: number) => {
    const updatedSets = exerciseData.sets.map((set) =>
      set.id === setId ? { ...set, isCompleted: !set.isCompleted } : set
    );
    setExerciseData({ ...exerciseData, sets: updatedSets });
  };

  const addSet = () => {
    const newSet: ExerciseSet = {
      id: (exerciseData.sets.at(-1)?.id || 0) + 1,
      reps: null,
      weight: null,
      isCompleted: false,
    };
    setExerciseData({ ...exerciseData, sets: [...exerciseData.sets, newSet] });
  };

  const removeSet = (setId: number) => {
    const updatedSets = exerciseData.sets.filter((set) => set.id !== setId);
    setExerciseData({ ...exerciseData, sets: updatedSets });
  };

  return (
    <div className="space-y-3">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-2 items-center px-2 font-semibold text-sm text-gray-500">
        <div className="col-span-2 text-center">SET</div>
        <div className="col-span-4 text-center">WEIGHT (KG)</div>
        <div className="col-span-4 text-center">REPS</div>
        <div className="col-span-2"></div>
      </div>

      {/* Set Rows */}
      {exerciseData.sets.map((set, index) => (
        <div
          key={set.id}
          className="grid grid-cols-12 gap-2 items-center"
        >
          <div className="col-span-2 flex justify-center items-center">
            <span className="font-bold text-gray-800 bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full">
              {index + 1}
            </span>
          </div>
          <Input
            type="number"
            placeholder="0"
            className="col-span-4 text-center"
            value={set.weight ?? ""}
            onChange={(e) => handleSetChange(set.id, "weight", e.target.value)}
          />
          <Input
            type="number"
            placeholder="0"
            className="col-span-4 text-center"
            value={set.reps ?? ""}
            onChange={(e) => handleSetChange(set.id, "reps", e.target.value)}
          />
          <div className="col-span-2 flex items-center justify-end space-x-2">
            <Checkbox
              checked={set.isCompleted}
              onCheckedChange={() => toggleSetCompletion(set.id)}
            />
            {exerciseData.sets.length > 1 && (
              <button
                onClick={() => removeSet(set.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}

      <Button onClick={addSet} variant="outline" className="w-full mt-2">
        <Plus className="w-4 h-4 mr-2" />
        Add Set
      </Button>
    </div>
  );
}
