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
    dailyCheckIn: {
      water: [8, 7, 9, 6, 8, 7, 9],
      energy: [7, 8, 6, 9, 7, 8, 8],
      sleep: [6, 7, 8, 7, 6, 8, 7],
      mood: [8, 7, 9, 8, 7, 8, 9]
    },
    programFill: {
      fitness: 75,
      nutrition: 82,
      wellness: 68
    },
    weightTrend: [68, 67.5, 67, 66.8, 66.5, 66.2, 66]
  },
  stats: {
    caloriesBurned: '2100 kcal',
    macros: 'P: 120g, C: 200g, F: 55g',
    minutesMeditated: '30 min',
  },
};
