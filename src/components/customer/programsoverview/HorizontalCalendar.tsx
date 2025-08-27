import {
  format,
  addDays,
  subDays,
  isSameDay,
  isPast,
  isToday,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { cn } from "@/lib/utils";
import { ScheduledTask, typeConfig } from "@/mockdata/programs/mockprograms";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HorizontalCalendar({
  selectedDate,
  setSelectedDate,
  schedule,
}: {
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
  schedule: ScheduledTask[];
}) {
  // State to manage the week being displayed. Defaults to the current date.
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calculate the start and end of the week based on the current date
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  // Generate an array of 7 dates for the current week
  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const handlePrevWeek = () => {
    setCurrentDate(subDays(currentDate, 7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  return (
    <div className="w-full space-y-4">
      {/* ## Week Navigation Header ## */}
      <div className="flex justify-between items-center px-2">
        <button
          onClick={handlePrevWeek}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="text-center font-semibold text-gray-800">
          {format(weekStart, "MMMM d")} - {format(weekEnd, "d, yyyy")}
        </div>
        <button
          onClick={handleNextWeek}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Next week"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* ## Days of the Week Grid ## */}
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date) => {
          const tasks = schedule.filter((t) => isSameDay(t.date, date));
          const hasTasks = tasks.length > 0;
          const hasMissedTasks =
            isPast(date) &&
            !isToday(date) &&
            tasks.some((t) => t.status === "missed");

          return (
            <button
              key={date.toString()}
              onClick={() => setSelectedDate(date)}
              className={cn(
                "p-2 rounded-xl text-center flex-shrink-0 transition-all duration-200 border-2 flex flex-col items-center justify-center h-24",
                isSameDay(date, selectedDate)
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-md scale-105"
                  : "bg-white hover:bg-gray-100",
                isToday(date) && !isSameDay(date, selectedDate)
                  ? "border-emerald-500"
                  : "border-transparent",
                hasMissedTasks && !isSameDay(date, selectedDate)
                  ? "bg-gray-100 text-gray-400 border-gray-200"
                  : ""
              )}
            >
              <div className="text-xs font-medium uppercase opacity-70">
                {format(date, "EEE")}
              </div>
              <div className="text-lg font-bold">{format(date, "d")}</div>
              <div className="flex justify-center items-center gap-1 mt-1 h-2">
                {hasTasks &&
                  tasks.map((t) => (
                    <div
                      key={t.id}
                      className={cn(
                        "w-2 h-2 rounded-full",
                        t.status === "missed" && isPast(t.date) && !isToday(date)
                          ? typeConfig[t.type].missedDot
                          : typeConfig[t.type].dot
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
