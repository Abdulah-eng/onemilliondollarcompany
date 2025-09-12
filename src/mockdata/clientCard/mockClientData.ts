// src/mockdata/clientCard/mockClientData.ts
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
    dailyCheckIn: [
      { date: '2025-09-06', water: 2.4, energy: 4, sleep: 7.0, mood: 4 },
      { date: '2025-09-07', water: 2.1, energy: 4, sleep: 6.5, mood: 3 },
      { date: '2025-09-08', water: 2.7, energy: 4, sleep: 7.2, mood: 4 },
      { date: '2025-09-09', water: 2.4, energy: 3, sleep: 7.1, mood: 3 },
      { date: '2025-09-10', water: 2.9, energy: 5, sleep: 8.2, mood: 5 },
      { date: '2025-09-11', water: 2.8, energy: 5, sleep: 8.0, mood: 4 },
      { date: '2025-09-12', water: 3.0, energy: 5, sleep: 7.8, mood: 5 },
    ],
    programFill: {
      fitness: 85,
      nutrition: 78,
      wellness: 92
    },
    weightTrend: [
      { date: '2025-08-01', weight: 68.0 },
      { date: '2025-08-08', weight: 67.5 },
      { date: '2025-08-15', weight: 67.0 },
      { date: '2025-08-22', weight: 66.8 },
      { date: '2025-08-29', weight: 66.5 },
      { date: '2025-09-05', weight: 66.2 },
      { date: '2025-09-12', weight: 66.0 },
    ],
  },
  stats: {
    caloriesBurned: '2100 kcal',
    macros: 'P: 120g, C: 200g, F: 55g',
    minutesMeditated: '30 min',
  },
};
