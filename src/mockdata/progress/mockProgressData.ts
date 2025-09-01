// src/mockdata/progress/mockProgressData.ts
import { subDays, format } from 'date-fns';

// --- INTERFACES ---

export interface WeightEntry {
  date: string; // "yyyy-MM-dd"
  weight: number; // in kg
}

export interface PhotoEntry {
  id: string;
  date: string; // "yyyy-MM-dd"
  imageUrl: string;
}

export interface DailyCheckin {
  date: string; // "yyyy-MM-dd"
  waterLiters: number;
  sleepHours: number;
  energyLevel: number; // 1-5
  mood: 'great' | 'good' | 'okay' | 'bad';
}

export interface MacroData {
  protein: number; // in grams
  carbs: number;
  fat: number;
  kcal: number;
}

export interface ProgressData {
  weightEntries: WeightEntry[];
  photoEntries: PhotoEntry[];
  dailyCheckins: DailyCheckin[];
  workoutStreak: number;
  totalCaloriesBurned: number;
  avgMeditationMinutes: number;
  nutrition: {
    last7Days: MacroData;
  };
  stressTrend: 'improving' | 'stable' | 'worsening';
}

// --- MOCK DATA GENERATION ---

const generateLast7DaysData = () => {
  const today = new Date();
  return Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(today, 6 - i);
    return {
      date: format(date, 'yyyy-MM-dd'),
      // Simulate slight daily fluctuations
      weight: 85.5 - i * 0.15 + (Math.random() - 0.5) * 0.2,
      waterLiters: 2.5 + Math.random(),
      sleepHours: 7 + (Math.random() - 0.5) * 2,
      energyLevel: Math.floor(3 + Math.random() * 2),
      mood: ['good', 'great', 'okay'][Math.floor(Math.random() * 3)] as 'good' | 'great' | 'okay',
    };
  });
};

const last7Days = generateLast7DaysData();

export const mockProgressData: ProgressData = {
  weightEntries: last7Days.map(({ date, weight }) => ({ date, weight })),
  photoEntries: [
    { id: 'p1', date: format(subDays(new Date(), 30), 'yyyy-MM-dd'), imageUrl: 'https://images.unsplash.com/photo-1554344227-013a30334887?q=80&w=800' },
    { id: 'p2', date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), imageUrl: 'https://images.unsplash.com/photo-1610018593251-e0d683793c3b?q=80&w=800' },
  ],
  dailyCheckins: last7Days,
  workoutStreak: 12,
  totalCaloriesBurned: 5230,
  avgMeditationMinutes: 15,
  nutrition: {
    last7Days: { protein: 140, carbs: 210, fat: 65, kcal: 2200 },
  },
  stressTrend: 'improving',
};
