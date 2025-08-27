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
  const weekMarkerRefs = useRef<{ [week: number]: HTMLDivElement | null }>({});

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
        entries.forEach((entry) => {
          const week = entry.target.getAttribute("data-week");
          if (entry.isIntersecting && week) setVisibleWeek(Number(week));
        });
      },
      { root: scrollContainerRef.current, threshold: 0.5 }
    );
    Object.values(weekMarkerRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [groupedDates]);

  return (
    <div className="w-full space-y-4">
      {/* Week Header */}
      <div className="text-center font-semibold text-gray-800 px-2">
        Week {visibleWeek} of {totalWeeks}
      </div>

      {/* Horizontal Calendar */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 scroll-smooth"
      >
        {Object.entries(groupedDates).map(([weekNumber, dates]) => (
          <div key={`week-${weekNumber}`} className="flex items-center gap-2">
            <div
              ref={(el) => (weekMarkerRefs.current[Number(weekNumber)] = el)}
              data-week={weekNumber}
              className="w-px h-1"
            ></div>

            {dates.map((date) => {
              const tasks = schedule.filter((t) => isSameDay(t.date, date));
              const hasTasks = tasks.length > 0;
              const hasMissedTasks = isPast(date) && !isToday(date) && tasks.some((t) => t.status === "missed");

              // Group tasks by type
              const tasksByType = Array.from(
                tasks.reduce((map, task) => {
                  if (!map.has(task.type)) map.set(task.type, []);
                  map.get(task.type)?.push(task);
                  return map;
                }, new Map<string, ScheduledTask[]>())
              );

              return (
                <button
                  key={date.toString()}
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
                  <div className="flex justify-center items-center gap-1 mt-1 h-4">
                    {tasksByType.map(([type, taskArr]) =>
                      taskArr.map((t) => (
                        <div
                          key={t.id}
                          className={cn(
                            "w-2 h-2 rounded-full",
                            t.status === "missed" && isPast(t.date) && !isToday(date)
                              ? typeConfig[t.type].missedDot
                              : typeConfig[t.type].dot
                          )}
                        />
                      ))
                    )}
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
