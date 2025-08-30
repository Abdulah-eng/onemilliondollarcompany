// src/mockdata/library/mockexercises.ts

export interface ExerciseGuide {
  id: string; 
  name: string;
  imageUrl: string; // Fallback image or poster for video
  videoUrl?: string; // Optional: URL for a video/gif
  description: string;
  benefits: string[];
  instructions: string[];
  proTip?: string;
  commonMistakes: string[];
  forBestResults: string[];
}

export const mockExerciseGuides: ExerciseGuide[] = [
  {
    id: "lib-bc",
    name: "Barbell Curl",
    imageUrl: "/images/barbell-curl-guide.png",
    // ✅ Example of a video URL added
    videoUrl: "/videos/barbell-curl.mp4", // Use a real path to your video file
    description: "Barbell Curl is a classic and effective biceps exercise that lets you train both arms simultaneously with solid resistance and a stable movement path.",
    benefits: ["Build big and strong biceps", "Increase arm volume with progressive overload", "Improve symmetry and upper body strength"],
    instructions: ["Stand with feet hip-width apart and grip the bar with a supinated grip (palms facing forward), about shoulder-width apart.", "Keep your elbows close to your body, chest up, and shoulders neutral.", "Bend at the elbows and lift the bar in a controlled motion toward your shoulders.", "Slowly lower the bar back down with a controlled tempo."],
    proTip: "Use an EZ bar if you have wrist issues – it reduces strain on the wrists and makes the exercise more ergonomic.",
    commonMistakes: ["Swinging the body to lift the bar.", "Raising the elbows forward.", "Lowering the bar too quickly."],
    forBestResults: ["Use moderate weight with good form.", "Hold a pause at the top for maximum contraction.", "Perform in the middle or start of the session when you’re fresh and focused."],
  },
  {
    id: "lib-sq",
    name: "Squats",
    imageUrl: "/images/squat-guide.png", // This one will just show an image
    description: "A fundamental compound exercise for building lower body strength.",
    benefits: ["Builds leg and glute muscles", "Improves core stability", "Increases bone density"],
    instructions: ["Keep your chest up and back straight.", "Lower your hips until your thighs are parallel to the floor.", "Push through your heels to return to the start."],
    proTip: "If you have trouble with depth, try placing a small plate under your heels.",
    commonMistakes: ["Letting your knees cave inward.", "Rounding your back.", "Not going deep enough."],
    forBestResults: ["Keep your core tight throughout the movement.", "Control the descent and explode up."],
  },
  // ... (rest of your mock data)
];

export const findExerciseGuideById = (id: string): ExerciseGuide | undefined => {
  return mockExerciseGuides.find((guide) => guide.id === id);
};
