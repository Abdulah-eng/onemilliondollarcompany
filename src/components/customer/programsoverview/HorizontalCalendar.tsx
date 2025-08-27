import { format, addDays, isSameDay, isPast, isToday } from "date-fns";
import { cn } from "@/lib/utils";
// ✅ CORRECTED IMPORT: Now importing both ScheduledTask and the shared typeConfig
import { ScheduledTask, typeConfig } from "@/mockdata/programs/mockPrograms";
import { useMemo, useRef, useEffect } from "react";

export default function HorizontalCalendar({
  selectedDate,
  setSelectedDate,
  schedule,
}: {
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
  schedule: ScheduledTask[];
}) {
  const dateListRef = useRef<HTMLDivElement>(null);

  // Create a scrolling list of dates (30 days past, today, 30 days future)
  const dates = useMemo(
    () => Array.from({ length: 61 }, (_, i) => addDays(new Date(), i - 30)),
    []
  );

  // Scroll to today's date on initial component mount
  useEffect(() => {
    const todayElement = document.getElementById(
      `date-${format(new Date(), "yyyy-MM-dd")}`
    );
    if (todayElement && dateListRef.current) {
      const scrollLeft =
        todayElement.offsetLeft -
        dateListRef.current.offsetWidth / 2 +
        todayElement.offsetWidth / 2;
      dateListRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, []);

  return (
    <div className="w-full">
      <div
        ref={dateListRef}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      >
        {dates.map((date) => {
          const tasks = schedule.filter((t) => isSameDay(t.date, date));
          const hasTasks = tasks.length > 0;
          // A day is "missed" if it's in the past and has at least one task with the 'missed' status
          const hasMissedTasks =
            isPast(date) &&
            !isToday(date) &&
            tasks.some((t) => t.status === "missed");

          return (
            <button
              key={date.toString()}
              id={`date-${format(date, "yyyy-MM-dd")}`}
              onClick={() => setSelectedDate(date)}
              className={cn(
                "p-2 rounded-xl min-w-[60px] text-center flex-shrink-0 transition-all duration-200 border-2",
                // Style for the currently selected date
                isSameDay(date, selectedDate)
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-md scale-105"
                  : "bg-white hover:bg-gray-100",
                // Style to highlight today's date (if not selected)
                isToday(date) && !isSameDay(date, selectedDate)
                  ? "border-emerald-500"
                  : "border-transparent",
                // Style to grey out past days with missed tasks (if not selected)
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
                        // ✅ CORRECTED LOGIC: Color each dot based on its individual task status
                        t.status === "missed" && isPast(t.date) && !isToday(t.date)
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
