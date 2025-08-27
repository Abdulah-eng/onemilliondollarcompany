import {
  format,
  isSameDay,
  isPast,
  isToday,
  startOfWeek,
  differenceInWeeks,
  eachDayOfInterval,
} from "date-fns";
import { cn } from "@/lib/utils";
import { ScheduledTask, typeConfig } from "@/mockdata/programs/mockprograms";
import { useState, useMemo, useEffect, useRef, memo } from "react";

// Group dates by week number
const groupDatesByWeek = (dates: Date[], programStartDate: Date) => {
  const grouped: { [week: number]: Date[] } = {};
  dates.forEach((date) => {
    const weekNumber =
      differenceInWeeks(
        startOfWeek(date, { weekStartsOn: 1 }),
        startOfWeek(programStartDate, { weekStartsOn: 1 })
      ) + 1;
    if (!grouped[weekNumber]) grouped[weekNumber] = [];
    grouped[weekNumber].push(date);
  });
  return grouped;
};

// Individual day component
const CalendarDay = memo(function CalendarDay({
  date,
  tasks,
  selectedDate,
  setSelectedDate,
  weekNumber,
  refCallback,
}: {
  date: Date;
  tasks: ScheduledTask[];
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
  weekNumber: number;
  refCallback?: (el: HTMLButtonElement | null) => void;
}) {
  const hasMissedTasks = isPast(date) && !isToday(date) && tasks.some((t) => t.status === "missed");
  const distinctTasks = useMemo(
    () => Array.from(new Map(tasks.map((t) => [t.type, t])).values()),
    [tasks]
  );

  return (
    <button
      ref={refCallback}
      data-week={weekNumber}
      id={`date-${format(date, "yyyy-MM-dd")}`}
      onClick={() => setSelectedDate(date)}
      className={cn(
        "p-2 rounded-xl min-w-[60px] text-center flex-shrink-0 flex flex-col items-center justify-center h-24 border-2 transition-transform duration-200",
        isSameDay(date, selectedDate)
          ? "bg-emerald-500 text-white border-emerald-500 shadow-md scale-105"
          : "bg-white hover:bg-gray-100 border-transparent",
        isToday(date) && !isSameDay(date, selectedDate) ? "border-emerald-500" : "",
        hasMissedTasks && !isSameDay(date, selectedDate) ? "bg-gray-100 text-gray-400 border-gray-200" : ""
      )}
    >
      <div className="text-xs font-medium uppercase opacity-70">{format(date, "EEE")}</div>
      <div className="text-lg font-bold">{format(date, "d")}</div>
      <div className="flex justify-center items-center gap-1.5 mt-1 h-4">
        {distinctTasks.map((task) => {
          const isTaskMissed = isPast(task.date) && !isToday(task.date) && task.status === 'missed';
          return (
            <span key={task.id} className={cn('text-sm', isTaskMissed && 'opacity-40 grayscale')}>
              {typeConfig[task.type].emoji}
            </span>
          );
        })}
      </div>
    </button>
  );
});

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
  const lastVisibleWeek = useRef(1);

  const totalWeeks = useMemo(
    () => differenceInWeeks(programEndDate, programStartDate) + 1,
    [programStartDate, programEndDate]
  );

  const groupedDates = useMemo(() => {
    const allDates = eachDayOfInterval({ start: programStartDate, end: programEndDate });
    return groupDatesByWeek(allDates, programStartDate);
  }, [programStartDate, programEndDate]);

  const tasksByDate = useMemo(() => {
    const map: Record<string, ScheduledTask[]> = {};
    schedule.forEach((task) => {
      const key = format(task.date, "yyyy-MM-dd");
      if (!map[key]) map[key] = [];
      map[key].push(task);
    });
    return map;
  }, [schedule]);

  // Scroll to today on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const todayEl = document.getElementById(`date-${format(new Date(), "yyyy-MM-dd")}`);
      if (todayEl && scrollContainerRef.current) {
        const scrollLeft = todayEl.offsetLeft - scrollContainerRef.current.offsetWidth / 2 + todayEl.offsetWidth / 2;
        scrollContainerRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Intersection observer to track visible week
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const week = Number(entry.target.getAttribute("data-week"));
            if (week && lastVisibleWeek.current !== week) {
              lastVisibleWeek.current = week;
              setVisibleWeek(week);
            }
          }
        });
      },
      { root: scrollContainerRef.current, threshold: 0.5 }
    );

    Object.values(weekMarkerRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [groupedDates]);

  // Scroll snapping
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.style.scrollSnapType = "x mandatory";
    container.querySelectorAll("div[data-week]").forEach((weekDiv) => {
      (weekDiv as HTMLElement).style.scrollSnapAlign = "start";
    });
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
          <div
            key={`week-${weekNumber}`}
            className="flex items-center gap-2"
            data-week={weekNumber}
          >
            {dates.map((date, index) => (
              <CalendarDay
                key={date.toString()}
                date={date}
                tasks={tasksByDate[format(date, "yyyy-MM-dd")] || []}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                weekNumber={Number(weekNumber)}
                refCallback={
                  index === 0
                    ? (el) => (weekMarkerRefs.current[Number(weekNumber)] = el)
                    : undefined
                }
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
