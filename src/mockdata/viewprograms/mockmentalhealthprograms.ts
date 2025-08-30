// src/mockdata/viewprograms/mockmentalhealthprograms.ts

export interface MentalHealthActivity {
  id: string;
  libraryActivityId: string;
  name: string;
  type: 'Meditation' | 'Journaling';
  durationMinutes: number;
  isCompleted: boolean;
}

export interface DetailedMentalHealthTask {
  id: string;
  type: 'mental'; // Important for dynamic rendering
  title: string;
  coachNotes: string;
  activities: MentalHealthActivity[];
  totalDurationMinutes: number;
}

const mockDetailedMentalHealthPrograms: DetailedMentalHealthTask[] = [
  {
    id: "t14", // Matches the ID from mockprograms.ts
    type: 'mental',
    title: "Afternoon Reset",
    coachNotes: "Take this time for yourself. Disconnect from distractions and focus on your inner state. You deserve this peace.",
    totalDurationMinutes: 15,
    activities: [
      { id: "mha-1", libraryActivityId: "mh-lib-1", name: "Guided Meditation", type: "Meditation", durationMinutes: 10, isCompleted: false },
      { id: "mha-2", libraryActivityId: "mh-lib-2", name: "Gratitude Journaling", type: "Journaling", durationMinutes: 5, isCompleted: false },
    ]
  }
];

export const findMentalHealthProgramById = (id: string): DetailedMentalHealthTask | undefined => {
  return mockDetailedMentalHealthPrograms.find((p) => p.id === id);
};
