import { useRef, useMemo, useEffect } from "react";
import { addDays, format, isSameDay, isToday, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import { ScheduledTask } from "@/pages/customer/MyProgramsPage"; // reuse type
import { typeConfig } from "./TaskCard";

const dayNameToIndex: Record<string, number> = {
  Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3,
  Friday: 4, Saturday: 5, Sunday: 6
};

export const HorizontalCalendar = ({
  selectedDate,
  setSelectedDate,
  schedule,
}: {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  schedule: ScheduledTask[];
}) => {
  const dateListRef = useRef<HTMLDivElement>(null);
  const dates = useMemo(() => Array.from({ length: 60 }, (_, i) => addDays(new Date(), i - 30)), []);

  useEffect(() => {
    const selectedEl = document.getElementById(`date-${format(selectedDate, "yyyy-MM-dd")}`);
    if (selectedEl && dateListRef.current) {
      const scrollLeft = selectedEl.offsetLeft - dateListRef.current.offsetWidth / 2 + selectedEl.offsetWidth / 2;
      dateListRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [selectedDate]);

  return (
    <div ref={dateListRef} className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
      {dates.map((date) => {
        const isSelected = isSameDay(date, selectedDate);
        const dayTasks = schedule.filter((t) => isSameDay(t.date, date));
        const uniqueTypes = [...new Set(dayTasks.map((t) => t.type))] as const;

        return (
          <button
            key={date.toString()}
            id={`date-${format(date, "yyyy-MM-dd")}`}
            onClick={() => setSelectedDate(date)}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-xl w-16 h-24 transition-all duration-200 shrink-0 border-2",
              isSelected ? "bg-emerald-500 text-white border-emerald-500 shadow-lg" : "bg-white hover:bg-slate-100 border-transparent",
              isToday(date) && !isSelected && "border-emerald-500"
            )}
          >
            <span className="text-xs uppercase font-semibold opacity-70">{format(date, "EEE")}</span>
            <span className="text-2xl font-bold">{format(date, "d")}</span>
            <div className="flex gap-1 mt-1 h-2">
              {uniqueTypes.map((type) => {
                const tasksOfType = dayTasks.filter((t) => t.type === type);
                const isAnyMissed = tasksOfType.some(t => t.status === "missed" && isPast(t.date) && !isToday(t.date));
                return (
                  <div key={type} className={cn("w-2 h-2 rounded-full", isAnyMissed ? typeConfig[type].missedDot : typeConfig[type].dot)} />
                );
              })}
            </div>
          </button>
        );
      })}
    </div>
  );
};
