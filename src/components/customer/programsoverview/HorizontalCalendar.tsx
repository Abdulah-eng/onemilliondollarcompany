// src/components/customer/programsoverview/HorizontalCalendar.tsx
import { format, addDays, isSameDay, isPast, startOfWeek, getDay } from "date-fns";
import { cn } from "@/lib/utils";
import { ScheduledTask } from "@/mockdata/programs/mockPrograms";

export default function HorizontalCalendar({
  selectedDate,
  setSelectedDate,
  schedule,
}: {
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
  schedule: ScheduledTask[];
}) {
  // Logic to ensure week starts on Monday (Sunday is 0, Monday is 1)
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    // Removed max-w-3xl and mx-auto, as the parent now handles centering.
    <div className="w-full">
      {/* Added justify-center to center the dates when they don't overflow */}
      <div className="flex justify-center gap-2 overflow-x-auto pb-2">
        {weekDates.map((date) => {
          const tasks = schedule.filter((t) => isSameDay(t.date, date));
          const hasMissed = tasks.some((t) => t.status === "missed" && isPast(t.date));

          return (
            <button
              key={date.toString()}
              onClick={() => setSelectedDate(date)}
              className={cn(
                "p-2 rounded-xl min-w-[60px] text-center flex-shrink-0 transition-colors",
                isSameDay(date, selectedDate)
                  ? "bg-emerald-500 text-white shadow-md"
                  : "bg-white hover:bg-gray-100"
              )}
            >
              <div className="text-xs font-medium uppercase opacity-70">{format(date, "EEE")}</div>
              <div className="text-lg font-bold">{format(date, "d")}</div>
              <div className="flex justify-center gap-1 mt-1 h-2">
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    className={cn("w-2 h-2 rounded-full",
                      hasMissed ? "bg-red-400" : "bg-green-500"
                    )}
                  ></div>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
