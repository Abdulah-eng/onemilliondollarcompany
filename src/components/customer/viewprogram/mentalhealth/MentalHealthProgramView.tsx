// src/components/customer/viewprogram/mentalhealth/MentalHealthProgramView.tsx

import { useState } from "react";
import { DetailedMentalHealthTask } from "@/mockdata/viewprograms/mockmentalhealthprograms";
import { findMentalHealthGuideById } from "@/mockdata/library/mockmentalexercises";
import ActivityCarousel from "./ActivityCarousel";
import ActivityDetails from "./ActivityDetails";
import MentalHealthGuide from "@/components/customer/library/mentalexercise/MentalHealthGuide";

interface MentalHealthProgramViewProps {
  initialData: DetailedMentalHealthTask;
}

export default function MentalHealthProgramView({ initialData }: MentalHealthProgramViewProps) {
  const [programData, setProgramData] = useState(initialData);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    programData.activities.length > 0 ? programData.activities[0].id : null
  );

  const handleActivityToggle = (activityId: string, isCompleted: boolean) => {
    setProgramData(prevData => {
      const newActivities = prevData.activities.map(act => 
        act.id === activityId ? { ...act, isCompleted } : act
      );
      return { ...prevData, activities: newActivities };
    });
  };

  const selectedActivity = programData.activities.find(a => a.id === selectedActivityId);
  const activityGuide = selectedActivity ? findMentalHealthGuideById(selectedActivity.libraryActivityId) : null;

  return (
    <main className="space-y-8 pb-20">
      <ActivityCarousel
        activities={programData.activities}
        selectedActivityId={selectedActivityId!}
        onSelectActivity={setSelectedActivityId}
      />
      {selectedActivity && (
        <ActivityDetails
          activity={selectedActivity}
          onActivityToggle={handleActivityToggle}
        />
      )}
      {activityGuide && <MentalHealthGuide guide={activityGuide} />}
    </main>
  );
}
