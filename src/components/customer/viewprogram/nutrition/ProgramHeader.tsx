// src/components/customer/viewprogram/ProgramHeader.tsx

import { DetailedFitnessTask } from "@/mockdata/viewprograms/mockexerciseprograms";
import { DetailedNutritionTask } from "@/mockdata/viewprograms/mocknutritionprograms";
import { typeConfig } from "@/mockdata/programs/mockprograms";
import { format } from "date-fns";
import { Calendar, Flame, Salad } from "lucide-react";

interface ProgramHeaderProps {
  task: DetailedFitnessTask | DetailedNutritionTask;
  type: 'fitness' | 'nutrition';
}

export default function ProgramHeader({ task, type }: ProgramHeaderProps) {
  const config = typeConfig[type];
  const Icon = type === 'fitness' ? Flame : Salad;

  return (
    <header className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <Icon className="w-4 h-4" />
        <span>{config.title}</span>
      </div>
      <h1 className="text-4xl font-extrabold tracking-tighter">{task.title}</h1>
      <div className="flex items-center gap-2 text-muted-foreground font-medium">
        <Calendar className="w-4 h-4" />
        <span>{format(new Date(task.date), "EEEE, MMMM d")}</span>
      </div>
    </header>
  );
}
