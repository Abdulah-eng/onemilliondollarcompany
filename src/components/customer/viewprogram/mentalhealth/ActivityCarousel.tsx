// src/components/customer/viewprogram/mentalhealth/ActivityCarousel.tsx

import { MentalHealthActivity } from "@/mockdata/viewprograms/mockmentalhealthprograms";
import ItemCarousel, { CarouselItem } from '../shared/ItemCarousel';

interface ActivityCarouselProps {
  activities: MentalHealthActivity[];
  selectedActivityId: string;
  onSelectActivity: (id: string) => void;
}

export default function ActivityCarousel({ activities, selectedActivityId, onSelectActivity }: ActivityCarouselProps) {
  // Transform specific activity data into the generic format
  const carouselItems: CarouselItem[] = activities.map(activity => ({
    id: activity.id,
    imageUrl: activity.imageUrl, // Assumes you've added this to your MentalHealthActivity type
    label: activity.name,        // Shows "Morning Meditation", etc.
    isCompleted: activity.isCompleted, // Assumes this property exists
  }));
  
  return (
    <ItemCarousel 
      items={carouselItems}
      selectedItemId={selectedActivityId}
      onSelectItem={onSelectActivity}
    />
  );
}
