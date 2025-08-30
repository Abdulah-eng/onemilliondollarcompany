
// src/mockdata/library/mockexercises.ts

export interface ExerciseGuide {
  id: string; // Corresponds to libraryExerciseId
  name: string;
  imageUrl: string;
  videoUrl?: string;
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
    imageUrl: "/images/barbell-curl-guide.png", // Replace with a real path
    description: "Barbell Curl is a classic and effective biceps exercise that lets you train both arms simultaneously with solid resistance and a stable movement path. It’s known for building biceps size and strength, providing a strong foundation for arm power and muscle growth.",
    benefits: ["Build big and strong biceps", "Increase arm volume with progressive overload", "Improve symmetry and upper body strength"],
    instructions: ["Stand with feet hip-width apart and grip the bar with a supinated grip (palms facing forward), about shoulder-width apart.", "Keep your elbows close to your body, chest up, and shoulders neutral.", "Bend at the elbows and lift the bar in a controlled motion toward your shoulders.", "Slowly lower the bar back down with a controlled tempo."],
    proTip: "Use an EZ bar if you have wrist issues – it reduces strain on the wrists and makes the exercise more ergonomic.",
    commonMistakes: ["Swinging the body to lift the bar.", "Raising the elbows forward.", "Lowering the bar too quickly."],
    forBestResults: ["Use moderate weight with good form.", "Hold a pause at the top for maximum contraction.", "Perform in the middle or start of the session when you’re fresh and focused."],
  },
  {
    id: "lib-sr",
    name: "Seated Row",
    imageUrl: "/images/seated-row-guide.png", // Replace with a real path
    description: "The seated row is a pulling exercise that works the back muscles, particularly the latissimus dorsi. It also works the forearm muscles and the upper arm muscles.",
    benefits: ["Strengthens back muscles", "Improves posture", "Increases pulling strength"],
    instructions: ["Sit on the bench with your knees bent and grasp the cable attachment.", "Keep your back straight, then pull the handle toward your lower abdomen.", "Squeeze your back muscles at the peak of the movement.", "Slowly return to the starting position."],
    commonMistakes: ["Rounding the lower back.", "Using momentum to pull the weight."],
    forBestResults: ["Focus on squeezing the shoulder blades together.", "Use a full range of motion."],
  },
  {
    id: "lib-sq",
    name: "Barbell Squat",
    imageUrl: "/images/squat-guide.png", // Replace with a real path
    description: "The barbell squat is a compound exercise that trains muscles in the thighs, hips and buttocks, quads, and hamstrings, and strengthens the bones, ligaments and insertion of the tendons throughout the lower body.",
    benefits: ["Builds lower body strength and muscle.", "Improves core stability.", "Increases bone density."],
    instructions: ["Stand with your feet shoulder-width apart, with the barbell resting on your upper back.", "Keeping your chest up and back straight, lower your body until your thighs are parallel to the floor.", "Push through your heels to return to the starting position."],
    commonMistakes: ["Letting your knees cave inward.", "Rounding your back.", "Not going deep enough."],
    forBestResults: ["Keep your core tight throughout the movement.", "Control the descent and explode up.", "Experiment with foot placement to find what's comfortable."],
  }
];

export const findExerciseGuideById = (id: string): ExerciseGuide | undefined => {
  return mockExerciseGuides.find((guide) => guide.id === id);
};
