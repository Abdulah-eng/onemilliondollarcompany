// src/components/customer/viewprogram/mentalhealth/ActivityDetails.tsx

import { MentalHealthActivity } from "@/mockdata/viewprograms/mockmentalhealthprograms";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Timer, CheckCircle, Edit3 } from "lucide-react";
import { useState } from "react";

interface ActivityDetailsProps {
  activity: MentalHealthActivity;
  onActivityToggle: (activityId: string, isCompleted: boolean) => void;
}

export default function ActivityDetails({ activity, onActivityToggle }: ActivityDetailsProps) {
  const [journalEntry, setJournalEntry] = useState("");

  return (
    <div className="w-full space-y-4 sm:rounded-2xl sm:bg-card sm:border sm:p-4">
      <div className="flex justify-between items-start gap-4 px-2 sm:px-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{activity.name}</h2>
          <p className="text-sm font-semibold text-muted-foreground">
            {activity.type}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-secondary-foreground flex-shrink-0">
          <Timer className="h-4 w-4" />
          <span className="font-mono text-sm font-semibold">{activity.durationMinutes} min</span>
        </div>
      </div>
      
      {activity.type === 'Journaling' && (
        <div className="px-2 sm:px-0 space-y-2">
            <label htmlFor="journal" className="flex items-center gap-2 font-semibold text-sm">
                <Edit3 className="w-4 h-4"/>
                Your thoughts
            </label>
            <Textarea 
                id="journal"
                placeholder="Write down what you're grateful for..." 
                className="h-32"
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
            />
        </div>
      )}

      {activity.type === 'Meditation' && (
         <div className="px-2 sm:px-0">
            <Button className="w-full h-12">
                Start Guided Meditation
            </Button>
         </div>
      )}

      <div className="flex items-center justify-between bg-background p-3 rounded-xl">
        <label htmlFor={`complete-${activity.id}`} className="font-bold text-lg">
          Mark as Complete
        </label>
        <Checkbox
          id={`complete-${activity.id}`}
          checked={activity.isCompleted}
          onCheckedChange={(checked) => onActivityToggle(activity.id, !!checked)}
          className="h-8 w-8 rounded-full data-[state=checked]:bg-primary"
        />
      </div>
    </div>
  );
}
