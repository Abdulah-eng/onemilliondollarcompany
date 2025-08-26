// src/pages/customer/Programs.tsx

import { useState, useEffect, useMemo, useRef } from "react";
import { format, addDays, isSameDay, isToday } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle2, Dumbbell, Apple, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Type config for program indicators ---
const typeConfig: Record<string, { Icon: any; color: string; dot: string }> = {
  fitness: { Icon: Dumbbell, color: "bg-emerald-500", dot: "bg-emerald-500" },
  nutrition: { Icon: Apple, color: "bg-amber-500", dot: "bg-amber-500" },
  mental: { Icon: Brain, color: "bg-indigo-500", dot: "bg-indigo-500" },
};

// --- Horizontal Calendar ---
const HorizontalCalendar = ({
  selectedDate,
  setSelectedDate,
  programs,
}: {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  programs: any[];
}) => {
  const dateListRef = useRef<HTMLDivElement>(null);
  const dates = useMemo(
    () => Array.from({ length: 30 }, (_, i) => addDays(new Date(), i - 15)),
    []
  );

  // center selected date on mount
  useEffect(() => {
    const selectedElement = document.getElementById(
      `date-${format(selectedDate, "yyyy-MM-dd")}`
    );
    if (selectedElement && dateListRef.current) {
      const scrollLeft =
        selectedElement.offsetLeft -
        dateListRef.current.offsetWidth / 2 +
        selectedElement.offsetWidth / 2;
      dateListRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, []);

  return (
    <div
      ref={dateListRef}
      className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
    >
      {dates.map((date) => {
        const isSelected = isSameDay(date, selectedDate);
        const dayPrograms = programs.filter((p) =>
          isSameDay(new Date(p.date), date)
        );

        return (
          <button
            key={date.toString()}
            id={`date-${format(date, "yyyy-MM-dd")}`}
            onClick={() => setSelectedDate(date)}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-xl w-14 h-20 transition-all duration-200 shrink-0",
              isSelected
                ? "bg-emerald-500 text-white shadow-md"
                : "hover:bg-slate-200",
              isToday(date) && !isSelected && "border-2 border-emerald-500"
            )}
          >
            <span className="text-xs uppercase font-semibold opacity-70">
              {format(date, "EEE")}
            </span>
            <span className="text-xl font-bold">{format(date, "d")}</span>

            {/* Dots for program types */}
            <div className="flex gap-1 mt-1">
              {dayPrograms.map((p, i) => (
                <div
                  key={i}
                  className={cn("w-1.5 h-1.5 rounded-full", typeConfig[p.type].dot)}
                />
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
};

// --- Program Card ---
const ProgramCard = ({ program, onClick }: { program: any; onClick: () => void }) => {
  const { Icon, color } = typeConfig[program.type];
  const isCompleted = program.progress === 100;

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-lg transition rounded-2xl border border-slate-200 bg-transparent backdrop-blur-sm"
    >
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={cn("p-2 rounded-full", color)}>
              <Icon className="w-5 h-5 text-white" />
            </span>
            <h3 className="font-bold text-slate-800">{program.title}</h3>
          </div>
          {isCompleted && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
        </div>
        <div className="text-sm text-slate-500">
          {program.plan.length} {program.plan.length > 1 ? "tasks" : "task"}
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${program.progress}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// --- Main Page ---
export default function ProgramsPage() {
  const [tab, setTab] = useState("active");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProgram, setSelectedProgram] = useState<any>(null);

  // --- mock programs ---
  const programs = [
    {
      id: 1,
      title: "Strength Training",
      type: "fitness",
      date: new Date(),
      progress: 60,
      plan: ["Warm-up", "Squats", "Push-ups"],
    },
    {
      id: 2,
      title: "Balanced Diet Plan",
      type: "nutrition",
      date: new Date(),
      progress: 100,
      plan: ["Breakfast", "Lunch", "Dinner"],
    },
    {
      id: 3,
      title: "Mindfulness Session",
      type: "mental",
      date: addDays(new Date(), 2),
      progress: 0,
      plan: ["Breathing", "Meditation"],
    },
  ];

  const todaysPrograms = programs.filter((p) =>
    isSameDay(new Date(p.date), selectedDate)
  );

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="p-4 space-y-6 bg-slate-50 min-h-screen">
      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-sm mx-auto bg-slate-200 rounded-xl p-1">
          <TabsTrigger
            value="active"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow"
          >
            Active
          </TabsTrigger>
          <TabsTrigger
            value="purchased"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow"
          >
            Purchased
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Calendar */}
      <HorizontalCalendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        programs={programs}
      />

      {/* Programs for the selected day */}
      <div className="space-y-4">
        {todaysPrograms.length === 0 ? (
          <div className="text-center py-12 rounded-2xl text-slate-500 border border-dashed border-slate-300">
            No programs scheduled for this day.
          </div>
        ) : (
          todaysPrograms.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onClick={() => setSelectedProgram(program)}
            />
          ))
        )}
      </div>

      {/* Drawer/Dialog for program details */}
      {isMobile ? (
        <Drawer open={!!selectedProgram} onOpenChange={() => setSelectedProgram(null)}>
          <DrawerContent className="p-4">
            {selectedProgram && (
              <div>
                <h2 className="text-xl font-bold mb-2">{selectedProgram.title}</h2>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedProgram.plan.map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={!!selectedProgram} onOpenChange={() => setSelectedProgram(null)}>
          <DialogContent className="sm:max-w-md">
            {selectedProgram && (
              <div>
                <h2 className="text-xl font-bold mb-2">{selectedProgram.title}</h2>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedProgram.plan.map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
