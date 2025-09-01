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

export interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
}

export interface FitnessTrend {
    id: string;
    exerciseName: string;
    trendPercentage: number; // e.g., 5 for a 5% increase
    currentAvg: number;
    unit: 'kg' | 'reps';
}

export interface MacroData {
  protein: number;
  carbs: number;
  fat: number;
  kcal: number;
}

export interface ProgressData {
  mainStats: {
    strain: number; // 0-100
    recovery: number; // 0-100
    sleep: number; // 0-100
  };
  goals: Goal[];
  weightEntries: WeightEntry[];
  photoEntries: PhotoEntry[];
  dailyCheckins: DailyCheckin[];
  fitnessTrends: FitnessTrend[];
  workoutStreak: number;
  avgMeditationMinutes: number;
  nutrition: MacroData;
  stressTrend: 'improving' | 'stable' | 'worsening';
}

// --- MOCK DATA GENERATION ---
export const mockProgressData: ProgressData = {
  mainStats: {
    strain: 68,
    recovery: 85,
    sleep: 92,
  },
  goals: [
    { id: 'g1', title: 'Reach Target Weight', current: 84.2, target: 82, unit: 'kg' },
    { id: 'g2', title: 'Weekly Workouts', current: 3, target: 4, unit: 'sessions' },
  ],
  weightEntries: Array.from({ length: 14 }).map((_, i) => ({
    date: format(subDays(new Date(), 13 - i), 'yyyy-MM-dd'),
    weight: 86.5 - i * 0.18 + (Math.random() - 0.5) * 0.3,
  })),
  photoEntries: [
    { id: 'p1', date: format(subDays(new Date(), 30), 'yyyy-MM-dd'), imageUrl: 'https://images.unsplash.com/photo-1554344227-013a30334887?q=80&w=800' },
    { id: 'p2', date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), imageUrl: 'https://images.unsplash.com/photo-1610018593251-e0d683793c3b?q=80&w=800' },
  ],
  dailyCheckins: Array.from({ length: 7 }).map((_, i) => ({
    date: format(subDays(new Date(), 6 - i), 'yyyy-MM-dd'),
    waterLiters: 2.5 + Math.random(),
    sleepHours: 7.5 + (Math.random() - 0.5),
    energyLevel: Math.floor(3 + Math.random() * 2.5),
    mood: ['good', 'great', 'okay'][Math.floor(Math.random() * 3)] as 'good',
  })),
  fitnessTrends: [
    { id: 'ft1', exerciseName: 'Squat', trendPercentage: 5, currentAvg: 90, unit: 'kg' },
    { id: 'ft2', exerciseName: 'Bench Press', trendPercentage: 2.5, currentAvg: 72.5, unit: 'kg' },
  ],
  workoutStreak: 12,
  avgMeditationMinutes: 15,
  nutrition: { protein: 145, carbs: 220, fat: 70, kcal: 2250 },
  stressTrend: 'improving',
};
