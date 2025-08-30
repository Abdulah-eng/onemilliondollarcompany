import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WorkoutExercise, ExerciseSet } from "@/mockdata/viewprograms/mockexerciseprograms";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Timer, PlusCircle, TrendingUp, TrendingDown, Minus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseDetailsProps {
  exercise: WorkoutExercise;
  onSetChange: (setIndex: number, updatedSet: Partial<ExerciseSet>) => void;
  onAddSet: () => void;
  onRemoveSet: (setIndex: number) => void;
}

// PerformanceInsight component remains the same. It's already working well.
const PerformanceInsight = ({ sets }: { sets: ExerciseSet[] }) => {
    const stats = useMemo(() => {
    let previousTotalKg = 0, previousSetsCount = 0, currentTotalKg = 0, currentSetsCount = 0;
    sets.forEach(set => {
      if (set.previous && set.previous.includes('@')) {
        const kg = parseFloat(set.previous.split('@')[1]);
        if (!isNaN(kg)) { previousTotalKg += kg; previousSetsCount++; }
      }
      if (set.performedKg !== null && set.performedKg > 0) {
        currentTotalKg += set.performedKg; currentSetsCount++;
      }
    });
    if (previousSetsCount === 0) return null;
    const previousAvgKg = previousTotalKg / previousSetsCount;
    if (currentSetsCount === 0) return { text: `Last time you averaged ${previousAvgKg.toFixed(1)} kg.`, Icon: Minus, color: "text-muted-foreground" };
    const currentAvgKg = currentTotalKg / currentSetsCount;
    const trend = ((currentAvgKg - previousAvgKg) / previousAvgKg) * 100;
    if (trend > 1) return { text: `Up ${trend.toFixed(0)}% from last time!`, Icon: TrendingUp, color: "text-emerald-500" };
    if (trend < -1) return { text: `Down ${Math.abs(trend).toFixed(0)}% from last time.`, Icon: TrendingDown, color: "text-red-500" };
    return { text: "Maintaining your strength. Solid work!", Icon: Minus, color: "text-blue-500" };
  }, [sets]);

  if (!stats) return null;
  const { text, Icon, color } = stats;
  return (
    <div className={cn("flex items-center gap-2 mt-2 text-xs font-semibold font-sans", color)}>
      <Icon className="w-4 h-4" />
      <span>{text}</span>
    </div>
  );
};

// ✅ NEW: A dedicated component for each set row with swipe-to-delete functionality.
const SetRow = ({ set, index, onSetChange, onRemoveSet, isOnlySet }: {
  set: ExerciseSet;
  index: number;
  onSetChange: (index: number, updatedSet: Partial<ExerciseSet>) => void;
  onRemoveSet: (index: number) => void;
  isOnlySet: boolean;
}) => {
  const getPreviousKg = (previousString: string) => {
    if (!previousString || !previousString.includes('@')) return "";
    return previousString.split('@')[1]?.trim().split(' ')[0] || "";
  };

  return (
    <div className="relative rounded-xl bg-background overflow-hidden">
      {/* --- Delete Background --- */}
      {!isOnlySet && (
        <div className="absolute inset-0 bg-red-500 flex justify-end items-center pr-6">
          <Trash2 className="h-6 w-6 text-white" />
        </div>
      )}
      
      {/* --- Draggable Set Content --- */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(event, info) => {
          if (info.offset.x < -100 && !isOnlySet) { // Swipe threshold
            onRemoveSet(index);
          }
        }}
        className="relative flex items-center gap-3 p-3 bg-background z-10"
      >
        <div className="w-8 flex-shrink-0 text-center font-bold text-lg text-primary">{index + 1}</div>
        
        <div className="flex-1">
          <Input
            type="number" inputMode="decimal"
            placeholder={getPreviousKg(set.previous)}
            value={set.performedKg ?? ""}
            onChange={(e) => onSetChange(index, { performedKg: parseFloat(e.target.value) || null })}
            className="w-full h-12 text-center font-semibold text-lg"
          />
        </div>

        <div className="flex-1">
          <Input
            type="number" inputMode="numeric"
            placeholder={set.targetReps}
            value={set.performedReps ?? ""}
            onChange={(e) => onSetChange(index, { performedReps: parseFloat(e.target.value) || null })}
            className="w-full h-12 text-center font-semibold text-lg"
          />
        </div>

        <div className="w-12 flex-shrink-0 flex justify-center">
          <Checkbox
            checked={set.completed}
            onCheckedChange={(checked) => onSetChange(index, { completed: !!checked })}
            className="h-10 w-10 data-[state=checked]:bg-primary"
          />
        </div>
      </motion.div>
    </div>
  );
};


export default function ExerciseDetails({ exercise, onSetChange, onAddSet, onRemoveSet }: ExerciseDetailsProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full space-y-5 rounded-2xl bg-card border p-4">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{exercise.name}</h2>
          <p className="text-sm font-semibold text-muted-foreground">{exercise.targetSets} Sets | Target: {exercise.sets[0]?.targetReps} Reps</p>
          <PerformanceInsight sets={exercise.sets} />
        </div>
        <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-secondary-foreground flex-shrink-0">
          <Timer className="h-4 w-4" />
          <span className="font-mono text-sm font-semibold">{formatTime(exercise.restTimeSeconds)}</span>
        </div>
      </div>
      
      {/* --- Simplified Header --- */}
      <div className="flex items-center gap-3 px-3 text-xs font-bold uppercase text-muted-foreground">
        <div className="w-8 text-center">Set</div>
        <div className="flex-1 text-center">KG</div>
        <div className="flex-1 text-center">Reps</div>
        <div className="w-12 text-center">✓</div>
      </div>
      
      {/* --- Animated Sets List --- */}
      <div className="space-y-3">
        <AnimatePresence>
          {exercise.sets.map((set, index) => (
            <motion.div
              key={index} // It's generally better to use a unique ID if available
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <SetRow
                set={set}
                index={index}
                onSetChange={onSetChange}
                onRemoveSet={onRemoveSet}
                isOnlySet={exercise.sets.length <= 1}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="pt-2">
        <Button
          onClick={onAddSet}
          variant="outline"
          className="w-full h-12 text-base rounded-xl"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Set
        </Button>
      </div>
    </div>
  );
}
