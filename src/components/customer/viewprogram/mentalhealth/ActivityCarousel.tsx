// src/components/customer/viewprogram/mentalhealth/ActivityCarousel.tsx

import { MentalHealthActivity } from "@/mockdata/viewprograms/mockmentalhealthprograms";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface ActivityCarouselProps {
  activities: MentalHealthActivity[];
  selectedActivityId: string;
  onSelectActivity: (id: string) => void;
}

const activityIcons: Record<string, string> = {
  Meditation: "🧘‍♀️",
  Journaling: "✍️",
};

export default function ActivityCarousel({ activities, selectedActivityId, onSelectActivity }: ActivityCarouselProps) {
  return (
    <div className="relative">
      <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
        {activities.map((activity) => {
          const isSelected = activity.id === selectedActivityId;
          return (
            <button
              key={activity.id}
              onClick={() => onSelectActivity(activity.id)}
              className={cn(
                "relative flex-shrink-0 w-28 h-28 rounded-xl p-2 flex flex-col items-center justify-center text-center transition-all duration-200 border-2",
                isSelected ? "bg-primary/10 border-primary" : "bg-card border-transparent hover:border-primary/50"
              )}
            >
              {activity.isCompleted && (
                <CheckCircle2 className="absolute top-1.5 right-1.5 h-5 w-5 text-green-500 fill-white" />
              )}
              <span className="text-4xl mb-1">{activityIcons[activity.type]}</span>
              <span className="text-xs font-semibold leading-tight">{activity.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
