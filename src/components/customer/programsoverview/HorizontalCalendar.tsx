// src/components/customer/programsoverview/HorizontalCalendar.tsx
import { format, addDays, isSameDay, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import { ScheduledTask } from "@/mockdata/programs/mockprograms";

export default function HorizontalCalendar({
  selectedDate,
  setSelectedDate,
  schedule,
}: {
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
  schedule: ScheduledTask[];
}) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const weekDates = days.map((_, i) => addDays(selectedDate, i - selectedDate.getDay() + 1));

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {weekDates.map((date) => {
          const tasks = schedule.filter((t) => isSameDay(t.date, date));
          const hasMissed = tasks.some((t) => t.status === "missed" && isPast(t.date));
          return (
            <button
              key={date.toString()}
              onClick={() => setSelectedDate(date)}
              className={cn(
                "p-2 rounded-xl min-w-[60px] text-center flex-shrink-0",
                isSameDay(date, selectedDate)
                  ? "bg-emerald-500 text-white"
                  : "bg-white"
              )}
            >
              <div className="text-xs">{format(date, "EEE")}</div>
              <div className="text-lg font-bold">{format(date, "d")}</div>
              <div className="flex justify-center gap-1 mt-1">
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    className={`w-2 h-2 rounded-full ${
                      hasMissed ? "bg-red-400" : "bg-green-500"
                    }`}
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
