// Interfaces for the mock data to ensure type safety
export interface IMotivationalCard {
  message: string;
}

export interface IProgram {
  id: string;
  title: string;
  progress: number;
  welcomeMessage: string;
}

export interface IUserProfile {
  goals: string;
  allergies: string;
  pastInjuries: string;
  likes: string;
  dislikes: string;
  preferredProgram: string;
}

export interface IMyCoachUser {
  name: string;
  status: string;
  statusColor: "green" | "red" | "orange" | "grey";
  assignedProgram: IProgram | null;
  motivationalCard: IMotivationalCard;
  userProfile: IUserProfile;
}

// Mock data for different user states
export const myCoachData: { [key: string]: IMyCoachUser } = {
  // Mock data for a user with an active program
  onTrackUser: {
    name: "John Doe",
    status: "On Track",
    statusColor: "green",
    assignedProgram: {
      id: "prog123",
      title: "Beginner's Fitness Journey",
      progress: 65,
      welcomeMessage: "Welcome to your new program, John! Let's get started. I'll be here to guide you every step of the way.",
    },
    motivationalCard: {
      message: "Consistency is key to success. You've got this!",
    },
    userProfile: {
      goals: "Lose 10kg",
      allergies: "Nuts",
      pastInjuries: "None",
      likes: "Hiking, strength training",
      dislikes: "Running, cardio",
      preferredProgram: "Fitness",
    },
  },
  
  // Mock data for a user who needs feedback
  needsFeedbackUser: {
    name: "Jane Smith",
    status: "Needs Feedback",
    statusColor: "orange",
    assignedProgram: {
      id: "prog456",
      title: "Mental Wellness & Journaling",
      progress: 80,
      welcomeMessage: "Hello Jane! I've seen your last few journal entries and I'm ready to provide feedback. Let's work on this together.",
    },
    motivationalCard: {
      message: "Take a moment to breathe and reflect. Your journey is uniquely yours.",
    },
    userProfile: {
      goals: "Improve mindfulness",
      allergies: "None",
      pastInjuries: "Ankle sprain (2020)",
      likes: "Meditation, yoga",
      dislikes: "High-intensity exercises",
      preferredProgram: "Mental Health",
    },
  },

  // Mock data for a user with no active program
  missingProgramUser: {
    name: "Alex Johnson",
    status: "Missing Program",
    statusColor: "red",
    assignedProgram: null,
    motivationalCard: {
      message: "Your new journey is about to begin. Your coach will assign a program soon!",
    },
    userProfile: {
      goals: "Build muscle",
      allergies: "Dairy",
      pastInjuries: "Shoulder pain",
      likes: "Weightlifting",
      dislikes: "Cardio",
      preferredProgram: "Fitness",
    },
  },

  // Mock data for a user whose program is about to expire
  soonToExpireUser: {
    name: "Sarah Miller",
    status: "Soon to Expire",
    statusColor: "orange",
    assignedProgram: {
      id: "prog789",
      title: "Nutrition for Weight Loss",
      progress: 95,
      welcomeMessage: "You're almost there! Just a few more days left. Let's discuss your next steps.",
    },
    motivationalCard: {
      message: "The final push is often the most rewarding.",
    },
    userProfile: {
      goals: "Healthy eating",
      allergies: "Gluten",
      pastInjuries: "None",
      likes: "Cooking, meal prepping",
      dislikes: "Processed foods",
      preferredProgram: "Nutrition",
    },
  }
};
