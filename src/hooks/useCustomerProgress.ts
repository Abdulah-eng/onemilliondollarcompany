import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useDailyCheckins } from './useDailyCheckins';

export interface ProgressData {
  dailyCheckins: Array<{
    date: string;
    water_liters: number | null;
    mood: number | null;
    energy: number | null;
    sleep_hours: number | null;
  }>;
  programEntries: Array<{
    id: string;
    program_id: string | null;
    date: string;
    type: 'fitness' | 'nutrition' | 'mental';
    notes: string | null;
    data: any;
  }>;
  workoutStreak: number;
  kcalBurnedLast7Days: number;
  userGoals: Array<{
    id: string;
    title: string;
    target: number;
    current: number;
    unit: string;
  }>;
  smartInsights: Array<{
    id: string;
    title: string;
    description: string;
    type: 'positive' | 'warning' | 'info';
  }>;
  fitnessProgression: {
    strength: Array<{ date: string; value: number }>;
    cardio: Array<{ date: string; value: number }>;
    flexibility: Array<{ date: string; value: number }>;
  };
  nutrition: {
    macros: Array<{
      date: string;
      protein: number;
      carbs: number;
      fat: number;
      calories: number;
    }>;
    waterIntake: Array<{ date: string; liters: number }>;
  };
  mentalHealth: {
    moodTrend: Array<{ date: string; value: number }>;
    stressLevel: Array<{ date: string; value: number }>;
    sleepQuality: Array<{ date: string; value: number }>;
  };
  photoEntries: Array<{
    id: string;
    date: string;
    imageUrl: string;
    notes?: string;
  }>;
}

export const useCustomerProgress = () => {
  const { user } = useAuth();
  const { checkins: dailyCheckins, last7Days } = useDailyCheckins();
  const [programEntries, setProgramEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgramEntries = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('program_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      setProgramEntries(data || []);
    } catch (e) {
      console.error('Failed to fetch program entries:', e);
    }
  };

  useEffect(() => {
    fetchProgramEntries();
  }, [user]);

  const progressData = useMemo((): ProgressData => {
    // Calculate workout streak from program entries
    const fitnessEntries = programEntries.filter(entry => entry.type === 'fitness');
    const sortedEntries = fitnessEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      const dayDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === streak) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate calories burned (mock calculation based on entries)
    const kcalBurnedLast7Days = fitnessEntries
      .filter(entry => {
        const entryDate = new Date(entry.date);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return entryDate >= sevenDaysAgo;
      })
      .reduce((total, entry) => total + (entry.data?.calories_burned || 0), 0);

    // Generate mock goals (in real app, these would come from onboarding or user settings)
    const userGoals = [
      { id: '1', title: 'Daily Water Intake', target: 2.5, current: 2.1, unit: 'L' },
      { id: '2', title: 'Weekly Workouts', target: 5, current: 3, unit: 'sessions' },
      { id: '3', title: 'Sleep Hours', target: 8, current: 7.2, unit: 'hours' },
    ];

    // Generate smart insights based on data
    const smartInsights = [];
    
    if (last7Days.length > 0) {
      const avgSleep = last7Days.reduce((sum, day) => sum + (day.sleep_hours || 0), 0) / last7Days.length;
      if (avgSleep < 7) {
        smartInsights.push({
          id: '1',
          title: 'Sleep Optimization',
          description: `Your average sleep is ${avgSleep.toFixed(1)} hours. Consider improving sleep hygiene.`,
          type: 'warning' as const
        });
      }
    }

    if (streak > 0) {
      smartInsights.push({
        id: '2',
        title: 'Workout Streak',
        description: `Great job! You've worked out for ${streak} consecutive days.`,
        type: 'positive' as const
      });
    }

    // Generate fitness progression data
    const fitnessProgression = {
      strength: last7Days.map((day, index) => ({
        date: day.date,
        value: 50 + (index * 5) + Math.random() * 10
      })),
      cardio: last7Days.map((day, index) => ({
        date: day.date,
        value: 30 + (index * 3) + Math.random() * 8
      })),
      flexibility: last7Days.map((day, index) => ({
        date: day.date,
        value: 40 + (index * 2) + Math.random() * 6
      }))
    };

    // Generate nutrition data
    const nutrition = {
      macros: last7Days.map(day => ({
        date: day.date,
        protein: 80 + Math.random() * 20,
        carbs: 200 + Math.random() * 50,
        fat: 60 + Math.random() * 15,
        calories: 1800 + Math.random() * 200
      })),
      waterIntake: last7Days.map(day => ({
        date: day.date,
        liters: day.water_liters || 0
      }))
    };

    // Generate mental health data
    const mentalHealth = {
      moodTrend: last7Days.map(day => ({
        date: day.date,
        value: day.mood || 3
      })),
      stressLevel: last7Days.map((day, index) => ({
        date: day.date,
        value: 3 + Math.random() * 2
      })),
      sleepQuality: last7Days.map(day => ({
        date: day.date,
        value: (day.sleep_hours || 0) / 8 * 5
      }))
    };

    // Generate photo entries (mock data)
    const photoEntries = [
      {
        id: '1',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        imageUrl: 'https://placehold.co/400x300',
        notes: 'Week 1 progress'
      },
      {
        id: '2',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        imageUrl: 'https://placehold.co/400x300',
        notes: 'Starting point'
      }
    ];

    return {
      dailyCheckins: dailyCheckins.map(checkin => ({
        date: checkin.date,
        water_liters: checkin.water_liters,
        mood: checkin.mood,
        energy: checkin.energy,
        sleep_hours: checkin.sleep_hours
      })),
      programEntries,
      workoutStreak: streak,
      kcalBurnedLast7Days,
      userGoals,
      smartInsights,
      fitnessProgression,
      nutrition,
      mentalHealth,
      photoEntries
    };
  }, [dailyCheckins, programEntries, last7Days]);

  return {
    progressData,
    loading,
    error,
    refetch: fetchProgramEntries
  };
};
