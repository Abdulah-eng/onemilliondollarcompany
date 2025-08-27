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

// Helper: group dates by week number
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

// Calendar day component
const CalendarDay = memo(function CalendarDay({
  id, // ✅ ID prop added
  date,
  tasks,
  selectedDate,
  setSelectedDate,
}: {
  id: string; // ✅ ID prop type added
  date: Date;
  tasks: ScheduledTask[];
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
}) {
  const hasMissedTasks = isPast(date) && !isToday(date) && tasks.some((t) => t.status === "missed");
  const distinctTasks = useMemo(
    () => Array.from(new Map(tasks.map((t) => [t.type, t])).values()),
    [tasks]
  );

  return (
    <button
      id={id} // ✅ ID applied to the button element
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
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // ✅ EFFECT TO SCROLL TO TODAY ON MOUNT
  useEffect(() => {
    const scrollToToday = () => {
      const todayEl = document.getElementById(`date-${format(new Date(), "yyyy-MM-dd")}`);
      if (todayEl && scrollRef.current) {
        const scrollLeft = todayEl.offsetLeft - scrollRef.current.offsetWidth / 2 + todayEl.offsetWidth / 2;
        scrollRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    };

    // Use a short timeout to ensure the DOM is fully rendered before scrolling
    const timer = setTimeout(scrollToToday, 100);
    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle visible week on scroll
  const onScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const children = Array.from(scrollRef.current.children) as HTMLElement[];
    let closestWeek = 1;
    let minDistance = Infinity;

    children.forEach((weekDiv, i) => {
      const distance = Math.abs(weekDiv.offsetLeft - scrollLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closestWeek = i + 1;
      }
    });

    if (closestWeek !== visibleWeek) setVisibleWeek(closestWeek);
  };

  return (
    <div className="w-full space-y-4">
      <div className="text-center font-semibold text-gray-800 px-2">
        Week {visibleWeek} of {totalWeeks}
      </div>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className={cn(
          "flex overflow-x-auto gap-2 py-2 scrollbar-hide scroll-smooth -mx-4 px-4",
          !isMobile && "snap-x snap-mandatory"
        )}
      >
        {Object.entries(groupedDates).map(([weekNumber, dates]) => (
          <div
            key={`week-${weekNumber}`}
            className={cn(
              "flex gap-2 justify-center",
              !isMobile ? "snap-start min-w-full" : ""
            )}
          >
            {dates.map((date) => (
              <CalendarDay
                key={date.toString()}
                id={`date-${format(date, "yyyy-MM-dd")}`} // ✅ ID prop passed here
                date={date}
                tasks={tasksByDate[format(date, "yyyy-MM-dd")] || []}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
