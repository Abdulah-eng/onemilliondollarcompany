import { MentalHealthActivity } from "@/mockdata/viewprograms/mockmentalhealthprograms";
import ItemCarousel, { CarouselItem } from '@/mockdata/viewprograms/shared/ItemCarousel';

interface ActivityCarouselProps {
  activities: MentalHealthActivity[];
  selectedActivityId: string;
  onSelectActivity: (id: string) => void;
}

export default function ActivityCarousel({ activities, selectedActivityId, onSelectActivity }: ActivityCarouselProps) {
  // Transform specific activity data into the generic format
  const carouselItems: CarouselItem[] = activities.map(activity => ({
    id: activity.id,
    imageUrl: activity.imageUrl,
    // ✅ Changed to use 'timeOfDay' for the label as requested
    label: activity.timeOfDay, 
    isCompleted: activity.isCompleted,
  }));
  
  return (
    <ItemCarousel 
      items={carouselItems}
      selectedItemId={selectedActivityId}
      onSelectItem={onSelectActivity}
    />
  );
}
