import {
  format,
  addDays,
  isSameDay,
  isPast,
  isToday,
  startOfWeek,
  differenceInWeeks,
  eachDayOfInterval,
} from "date-fns";
import { cn } from "@/lib/utils";
import { ScheduledTask, typeConfig } from "@/mockdata/programs/mockprograms";
import { useState, useMemo, useEffect, useRef } from "react";

// Helper: group dates by week number
const groupDatesByWeek = (dates: Date[], programStartDate: Date) => {
  const grouped: { [week: number]: Date[] } = {};
  dates.forEach((date) => {
    const weekNumber =
      differenceInWeeks(startOfWeek(date, { weekStartsOn: 1 }), startOfWeek(programStartDate, { weekStartsOn: 1 })) + 1;
    if (!grouped[weekNumber]) grouped[weekNumber] = [];
    grouped[weekNumber].push(date);
  });
  return grouped;
};

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
  const [visibleWeek, setVisibleWeek] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const weekMarkerRefs = useRef<{ [week: number]: HTMLButtonElement | null }>({});

  const totalWeeks = useMemo(
    () => differenceInWeeks(programEndDate, programStartDate) + 1,
    [programStartDate, programEndDate]
  );

  const groupedDates = useMemo(() => {
    const allDates = eachDayOfInterval({ start: programStartDate, end: programEndDate });
    return groupDatesByWeek(allDates, programStartDate);
  }, [programStartDate, programEndDate]);

  // Scroll to today's date initially
  useEffect(() => {
    const todayEl = document.getElementById(`date-${format(new Date(), "yyyy-MM-dd")}`);
    if (todayEl && scrollContainerRef.current) {
      const scrollLeft = todayEl.offsetLeft - scrollContainerRef.current.offsetWidth / 2 + todayEl.offsetWidth / 2;
      scrollContainerRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, []);

  // Intersection observer to update visible week
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                const week = entry.target.getAttribute("data-week");
                if (week) {
                    setVisibleWeek(Number(week));
                    // Stop after the first intersecting entry to prevent multiple updates
                    return;
                }
            }
        }
      },
      { root: scrollContainerRef.current, threshold: 0.5 }
    );
    Object.values(weekMarkerRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [groupedDates]);

  return (
    <div className="w-full space-y-4">
      <div className="text-center font-semibold text-gray-800 px-2">
        Week {visibleWeek} of {totalWeeks}
      </div>

      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-hide -mx-4 px-4 scroll-smooth"
      >
        {Object.entries(groupedDates).map(([weekNumber, dates]) => (
          <div key={`week-${weekNumber}`} className="flex items-center gap-2">
            {dates.map((date, index) => {
              const tasks = schedule.filter((t) => isSameDay(t.date, date));
              const hasMissedTasks = isPast(date) && !isToday(date) && tasks.some((t) => t.status === "missed");

              // Get a unique list of tasks to prevent duplicate emojis
              const distinctTasks = Array.from(new Map(tasks.map(t => [t.type, t])).values());

              return (
                <button
                  key={date.toString()}
                  ref={index === 0 ? (el) => (weekMarkerRefs.current[Number(weekNumber)] = el) : undefined}
                  data-week={weekNumber}
                  id={`date-${format(date, "yyyy-MM-dd")}`}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "p-2 rounded-xl min-w-[60px] text-center flex-shrink-0 transition-all duration-200 border-2 flex flex-col items-center justify-center h-24",
                    isSameDay(date, selectedDate)
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-md scale-105"
                      : "bg-white hover:bg-gray-100",
                    isToday(date) && !isSameDay(date, selectedDate) ? "border-emerald-500" : "border-transparent",
                    hasMissedTasks && !isSameDay(date, selectedDate) ? "bg-gray-100 text-gray-400 border-gray-200" : ""
                  )}
                >
                  <div className="text-xs font-medium uppercase opacity-70">{format(date, "EEE")}</div>
                  <div className="text-lg font-bold">{format(date, "d")}</div>
                  <div className="flex justify-center items-center gap-1.5 mt-1 h-4">
                    {distinctTasks.map((task) => {
                      const isTaskMissed = isPast(task.date) && !isToday(task.date) && task.status === 'missed';
                      return (
                        <span
                          key={task.id}
                          className={cn('text-sm', isTaskMissed && 'opacity-40 grayscale')}
                        >
                          {typeConfig[task.type].emoji}
                        </span>
                      );
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
