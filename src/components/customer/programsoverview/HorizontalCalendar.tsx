import {
  format,
  addDays,
  subDays,
  isSameDay,
  isPast,
  isToday,
  startOfWeek,
  differenceInWeeks,
  isBefore,
  isAfter,
} from "date-fns";
import { cn } from "@/lib/utils";
import { ScheduledTask, typeConfig } from "@/mockdata/programs/mockprograms";
import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HorizontalCalendar({
  selectedDate,
  setSelectedDate,
  schedule,
  programStartDate,
  programEndDate,
}: {
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
  schedule: ScheduledTask[];
  programStartDate: Date;
  programEndDate: Date;
}) {
  // The date that determines which week to show. Initialize to today's date.
  const [currentDate, setCurrentDate] = useState(new Date());

  // Set the calendar to the program's start week if today's date is before the program starts
  useEffect(() => {
    if (isBefore(new Date(), programStartDate)) {
      setCurrentDate(programStartDate);
    }
  }, [programStartDate]);


  // Calculate total weeks and the current week number
  const totalWeeks = differenceInWeeks(programEndDate, programStartDate) + 1;
  const currentWeekNumber = differenceInWeeks(startOfWeek(currentDate, { weekStartsOn: 1 }), startOfWeek(programStartDate, { weekStartsOn: 1 })) + 1;

  // Determine if navigation is possible
  const canGoBack = currentWeekNumber > 1;
  const canGoForward = currentWeekNumber < totalWeeks;

  const handlePrevWeek = () => {
    if (canGoBack) {
      setCurrentDate(subDays(currentDate, 7));
    }
  };

  const handleNextWeek = () => {
    if (canGoForward) {
      setCurrentDate(addDays(currentDate, 7));
    }
  };
  
  // Generate an array of 7 dates for the current week
  const weekDates = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [currentDate]);

  return (
    <div className="w-full space-y-4">
      {/* ## Week Navigation Header ## */}
      <div className="flex justify-between items-center px-2">
        <button
          onClick={handlePrevWeek}
          disabled={!canGoBack}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous week"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="text-center font-semibold text-gray-800">
          Week {currentWeekNumber} of {totalWeeks}
        </div>
        <button
          onClick={handleNextWeek}
          disabled={!canGoForward}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next week"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* ## Days of the Week Grid ## */}
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date) => {
          // A date is out of bounds if it's before the program start or after the end
          const isOutOfBounds = isBefore(date, programStartDate) || isAfter(date, programEndDate);
          const tasks = isOutOfBounds ? [] : schedule.filter((t) => isSameDay(t.date, date));
          const hasTasks = tasks.length > 0;
          const hasMissedTasks = isPast(date) && !isToday(date) && tasks.some((t) => t.status === "missed");

          return (
            <button
              key={date.toString()}
              onClick={() => !isOutOfBounds && setSelectedDate(date)}
              disabled={isOutOfBounds}
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
                  : "",
                isOutOfBounds ? "bg-gray-50 text-gray-300 cursor-not-allowed" : ""
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
                      className={cn("w-2 h-2 rounded-full", t.status === "missed" && isPast(t.date) && !isToday(date) ? typeConfig[t.type].missedDot : typeConfig[t.type].dot)}
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
