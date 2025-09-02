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

export interface PrTimelineEntry {
    id: string;
    exerciseName: string;
    bestLift: number;
    unit: string;
    change: number;
}

export interface VolumeEntry {
    date: string; // Week start date
    volume: number; // in kg
}

export interface MacroEntry {
    protein: number;
    carbs: number;
    fat: number;
}

export interface StressLogEntry {
    date: string;
    level: number; // 1-10
}

export interface Insight {
    id: string;
    text: string;
    type: 'positive' | 'warning';
}


export interface ProgressData {
  // 1. Hero
  weightGoal: {
      start: number;
      current: number;
      target: number;
  };
  currentStreak: number;
  avgSleep: number; // last 7 days
  avgEnergy: number; // last 7 days

  // 2. Daily Check-ins
  dailyCheckins: DailyCheckin[];

  // 3. Fitness
  prTimeline: PrTimelineEntry[];
  volumeTrend: VolumeEntry[];
  workoutConsistency: number; // percentage

  // 4. Nutrition
  macrosTrend: {
      current: MacroEntry;
      target: MacroEntry;
  };
  mealCompletion: number; // percentage
  otherFoodsLogged: number;

  // 5. Mental Health
  meditationTrend: { date: string, minutes: number }[];
  yogaStreak: number;
  stressLog: StressLogEntry[];

  // 6. Weight & Body Composition
  weightEntries: WeightEntry[];
  photoEntries: PhotoEntry[];
  
  // 7. Smart Insights
  smartInsights: Insight[];
}

// --- MOCK DATA GENERATION ---
export const mockProgressData: ProgressData = {
  // 1. Hero
  weightGoal: { start: 86.5, current: 84.2, target: 82 },
  currentStreak: 14,
  avgSleep: 7.8,
  avgEnergy: 4.2,

  // 2. Daily Check-ins
  dailyCheckins: Array.from({ length: 7 }).map((_, i) => ({
    date: format(subDays(new Date(), 6 - i), 'MMM d'),
    waterLiters: 2.5 + Math.random(),
    sleepHours: 7.5 + (Math.random() - 0.5) * 2,
    energyLevel: Math.floor(3 + Math.random() * 2.5),
    mood: ['good', 'great', 'okay'][Math.floor(Math.random() * 3)] as 'good',
  })),

  // 3. Fitness
  prTimeline: [
      { id: 'pr1', exerciseName: 'Deadlift', bestLift: 140, unit: 'kg', change: 10 },
      { id: 'pr2', exerciseName: 'Squat', bestLift: 115, unit: 'kg', change: 5 },
      { id: 'pr3', exerciseName: 'Bench Press', bestLift: 85, unit: 'kg', change: 2.5 },
  ],
  volumeTrend: Array.from({ length: 4 }).map((_, i) => ({
      date: `Week ${i + 1}`,
      volume: 12500 + i * 800 + Math.random() * 500,
  })),
  workoutConsistency: 85,

  // 4. Nutrition
  macrosTrend: {
      current: { protein: 155, carbs: 210, fat: 65 },
      target: { protein: 160, carbs: 200, fat: 70 },
  },
  mealCompletion: 92,
  otherFoodsLogged: 4,

  // 5. Mental Health
  meditationTrend: Array.from({ length: 7 }).map((_, i) => ({
    date: format(subDays(new Date(), 6 - i), 'MMM d'),
    minutes: Math.max(0, Math.floor(10 + (Math.random() - 0.3) * 15)),
  })),
  yogaStreak: 7,
  stressLog: Array.from({ length: 14 }).map((_, i) => ({
    date: format(subDays(new Date(), 13 - i), 'MMM d'),
    level: Math.floor(3 + Math.random() * 4),
  })),

  // 6. Weight & Body Composition
  weightEntries: Array.from({ length: 30 }).map((_, i) => ({
    date: format(subDays(new Date(), 29 - i), 'yyyy-MM-dd'),
    weight: 86.5 - i * 0.08 + (Math.random() - 0.5) * 0.4,
  })),
  photoEntries: [
    { id: 'p1', date: format(subDays(new Date(), 30), 'yyyy-MM-dd'), imageUrl: 'https://images.unsplash.com/photo-1554344227-013a30334887?q=80&w=800' },
    { id: 'p2', date: format(subDays(new Date(), 15), 'yyyy-MM-dd'), imageUrl: 'https://images.unsplash.com/photo-1594757599142-7a08c8b18a16?q=80&w=800' },
    { id: 'p3', date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), imageUrl: 'https://images.unsplash.com/photo-1610018593251-e0d683793c3b?q=80&w=800' },
  ],

  // 7. Smart Insights
  smartInsights: [
      { id: 's1', text: 'On weeks with 7h+ sleep, you have a 20% higher workout adherence.', type: 'positive' },
      { id: 's2', text: 'Water intake is trending down, which may explain recent lower energy scores.', type: 'warning' },
      { id: 's3', text: 'Your protein consistency this month is strongly correlated with your PR gains.', type: 'positive' },
  ]
};
