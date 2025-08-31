// src/mockdata/viewprograms/mockdetailedviews.ts

// A generic interface for a single item in the detailed view
export interface DetailViewItem {
  name: string;
  imageUrl: string;
  details: string; // e.g., "3 sets, 8-10 reps", "Breakfast", "Afternoon"
}

// Interface for a full, detailed task
export interface DetailedTask {
  id: string; // Must match detailedProgramId from mockprograms.ts
  type: "fitness" | "nutrition" | "mental";
  content: DetailViewItem[];
}

const mockDetailedTasks: DetailedTask[] = [
  {
    id: "t9", // Matches the detailedProgramId for "Push Day"
    type: "fitness",
    content: [
      { name: "Incline Press", imageUrl: "/images/incline-press-thumb.png", details: "3 sets, 8-10 reps" },
      { name: "Flyes", imageUrl: "/images/flyes-thumb.png", details: "2 sets, 12-15 reps" },
      { name: "Dips", imageUrl: "/images/dips-thumb.png", details: "2 sets, AMRAP" },
    ]
  },
  {
    id: "n-1", // Matches the detailedProgramId for "Lean Gain Meal Plan"
    type: "nutrition",
    content: [
      { name: "Oatmeal Delight", imageUrl: "/images/oatmeal.jpg", details: "Breakfast" },
      { name: "Chicken Salad", imageUrl: "/images/salad.jpg", details: "Lunch" },
      { name: "Salmon & Veggies", imageUrl: "/images/salmon.jpg", details: "Dinner" },
    ]
  },
  {
    id: "t14", // Matches the detailedProgramId for "Afternoon Reset"
    type: "mental",
    content: [
       { name: "Guided Meditation", imageUrl: "/images/meditation.jpg", details: "Afternoon" },
       { name: "Gratitude Journaling", imageUrl: "/images/journaling.jpg", details: "Afternoon" },
    ]
  },
  // Add other detailed tasks here to match all other detailedProgramIds...
];

export const findDetailedTaskById = (id: string): DetailedTask | undefined => {
  return mockDetailedTasks.find(task => task.id === id);
};
