// src/mockdata/clientCard/mockClientData.ts
import { format, subDays, subMonths } from 'date-fns';

const generateMockData = (days: number) => {
  const data = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = subDays(today, days - 1 - i);
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      water: Math.random() * 1.5 + 1.5, // 1.5 to 3.0 liters
      energy: Math.floor(Math.random() * 5) + 1, // 1-5 scale
      sleep: Math.random() * 2 + 6, // 6.0 to 8.0 hours
      mood: Math.floor(Math.random() * 5) + 1, // 1-5 scale
      stress: Math.floor(Math.random() * 5) + 1, // 1-5 scale
      anxiety: Math.floor(Math.random() * 5) + 1, // 1-5 scale
      meditationTime: Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 5 : 0, // 5-25 min
      yogaTime: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 15 : 0, // 15-45 min
      portionTracked: Math.random() * 10 + 5, // 5-15 portions
      ateElse: Math.random() > 0.3,
    });
  }
  return data;
};

const generateWeightData = (months: number) => {
  const data = [];
  const today = new Date();
  let currentWeight = 68.8; // Starting weight
  for (let i = 0; i < months * 4; i++) {
    const date = subDays(today, (months * 4 - 1 - i) * 7); // weekly data points
    currentWeight -= Math.random() * 0.2 + 0.1; // simulate slight weight loss
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      weight: parseFloat(currentWeight.toFixed(1)),
    });
  }
  return data;
};

// Simplified function to calculate trends
const calculateTrends = (data: any[]) => {
  const latestData = data.slice(-14);
  const getTrend = (key: string) => {
    if (latestData.length < 2) return '—';
    const firstHalfAvg = latestData.slice(0, Math.floor(latestData.length / 2)).reduce((sum, d) => sum + d[key], 0) / Math.floor(latestData.length / 2);
    const secondHalfAvg = latestData.slice(Math.ceil(latestData.length / 2)).reduce((sum, d) => sum + d[key], 0) / Math.ceil(latestData.length / 2);
    const diff = secondHalfAvg - firstHalfAvg;
    if (Math.abs(diff) < 0.3) return '→';
    return diff > 0 ? '↑' : '↓';
  };
  return {
    mood: getTrend('mood'),
    sleep: getTrend('sleep'),
    energy: getTrend('energy'),
    stress: getTrend('stress'),
  };
};

const allDailyData = generateMockData(180);
const allWeightData = generateWeightData(6);
const trends = calculateTrends(allDailyData);

export const mockClientData = {
  id: 'client_123',
  name: 'Jessica Lee',
  plan: 'Premium',
  status: 'On Track',
  color: 'bg-green-500',
  profilePicture: 'https://i.pravatar.cc/150?u=jessica-lee',
  personalInfo: {
    age: 32,
    gender: 'Female',
    height: '170 cm',
    weight: '65 kg',
  },
  goals: ['Fat Reduce', 'Increased Energy'],
  preferences: {
    injuries: ['Knee (old injury)'],
    allergies: ['Peanuts'],
    likes: ['Spicy food', 'HIIT workouts'],
    dislikes: ['Running', 'Boring exercises'],
    preferredProgramType: ['Fitness'],
  },
  insights: {
    programProgress: '75%',
    avgDailyCheckIn: '95%',
    adherence: '92%',
    nextFollowUp: 'Sep 25',
  },
  stats: {
    caloriesBurned: '2100 kcal',
    macros: 'P: 120g, C: 200g, F: 55g',
    minutesMeditated: '30 min',
  },
  programFill: {
    fitness: 85,
    nutrition: 78,
    mentalHealth: 92
  },
  dailyCheckIn: allDailyData,
  weightTrend: allWeightData,
  progressPhotos: [
    { url: 'https://images.unsplash.com/photo-1549476317-09f19318b76c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', date: '2025-07-01', isNewest: false },
    { url: 'https://images.unsplash.com/photo-1549476317-09f19318b76c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', date: '2025-08-01', isNewest: false },
    { url: 'https://images.unsplash.com/photo-1549476317-09f19318b76c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', date: '2025-09-01', isNewest: true },
  ],
  trends: trends,
  nutrition: {
    adherence: 85,
    adherenceMessage: 'Maintains consistent meal tracking.',
    portionsPerDay: 7.2,
    portionMessage: 'Average portions tracked daily.',
    micronutrientStatus: {
      fiber: 'adequate',
      iron: 'low',
      vitamin_d: 'adequate',
    },
  },
  mentalHealth: {
    avgStress: 2.5,
    stressTrend: trends.stress,
    avgAnxiety: 2.1,
    anxietyTrend: trends.stress, // Using stress trend for anxiety for mock data
    meditationTime: 15,
    meditationTrend: '↑',
    meditationValue: 'Consistent daily practice.',
    yogaTime: 30,
    yogaTrend: '→',
    yogaValue: 'Occasional sessions, consistent duration.',
  },
};
