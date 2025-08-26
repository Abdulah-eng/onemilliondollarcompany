// src/components/customer/programsoverview/WeeklyCalendar.tsx
import { addDays, startOfWeek, format, isSameDay, isToday, isPast } from "date-fns";
import { ScheduledTask, typeConfig } from "./TaskCard";
import { cn } from "@/lib/utils";

export default function WeeklyCalendar({
  selectedDate,
  setSelectedDate,
  schedule,
  weekOffset,
  setWeekOffset,
}: {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  schedule: ScheduledTask[];
  weekOffset: number;
  setWeekOffset: (offset: number) => void;
}) {
  const weekStart = startOfWeek(addDays(new Date(), weekOffset * 7), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center mb-2">
        <button onClick={() => setWeekOffset(weekOffset - 1)} className="px-3 py-1 rounded bg-emerald-500 text-white">◀ Prev</button>
        <span className="font-semibold">{format(weekStart, "MMM do")} - {format(addDays(weekStart, 6), "MMM do")}</span>
        <button onClick={() => setWeekOffset(weekOffset + 1)} className="px-3 py-1 rounded bg-emerald-500 text-white">Next ▶</button>
      </div>
      <div className="flex justify-between">
        {weekDays.map((date) => {
          const dayTasks = schedule.filter(t => isSameDay(t.date, date));
          const uniqueTypes = [...new Set(dayTasks.map(t => t.type))] as const;

          return (
            <button
              key={date.toString()}
              onClick={() => setSelectedDate(date)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl w-16 transition-all duration-200",
                isSameDay(date, selectedDate) ? "bg-emerald-500 text-white shadow-lg" : "bg-white hover:bg-slate-100",
                isToday(date) && "border-2 border-emerald-500"
              )}
            >
              <span className="text-xs font-semibold">{format(date, "EEE")}</span>
              <span className="text-2xl font-bold">{format(date, "d")}</span>
              <div className="flex gap-1 mt-1 h-2">
                {uniqueTypes.map((type) => {
                  const tasksOfType = dayTasks.filter((t) => t.type === type);
                  const isAnyMissed = tasksOfType.some(t => t.status === "missed" && isPast(t.date) && !isToday(t.date));
                  return <div key={type} className={cn("w-2 h-2 rounded-full", isAnyMissed ? typeConfig[type].missedDot : typeConfig[type].dot)} />;
                })}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
