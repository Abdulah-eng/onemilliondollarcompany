// src/mockdata/library/mockexercises.ts

export interface ExerciseGuide {
  id: string; // Corresponds to libraryExerciseId
  name: string;
  imageUrl: string;
  description: string;
  benefits: string[];
  instructions: string[];
  proTip?: string;
  commonMistakes: string[];
  forBestResults: string[];
}

export const mockExerciseGuides: ExerciseGuide[] = [
  {
    id: "lib-sq",
    name: "Squats",
    imageUrl: "/images/squat-guide.png",
    description: "A fundamental compound exercise for building lower body strength.",
    benefits: ["Builds leg and glute muscles", "Improves core stability", "Increases bone density"],
    instructions: ["Keep your chest up and back straight.", "Lower your hips until your thighs are parallel to the floor.", "Push through your heels to return to the start."],
    proTip: "If you have trouble with depth, try placing a small plate under your heels.",
    commonMistakes: ["Letting your knees cave inward.", "Rounding your back.", "Not going deep enough."],
    forBestResults: ["Keep your core tight throughout the movement.", "Control the descent and explode up."],
  },
  {
    id: "lib-lp",
    name: "Leg Press",
    imageUrl: "/images/leg-press-guide.png",
    description: "A machine-based exercise that targets the quads, hamstrings, and glutes.",
    benefits: ["Isolates leg muscles", "Allows for heavy weight with support"],
    instructions: ["Position your feet shoulder-width apart on the platform.", "Lower the weight until your knees are at a 90-degree angle.", "Press the weight back up, but do not lock your knees."],
    proTip: "Changing your foot position can target different muscles. Higher for glutes, lower for quads.",
    commonMistakes: ["Using a partial range of motion.", "Lifting your hips off the seat.", "Locking out your knees at the top."],
    forBestResults: ["Focus on a slow, controlled negative.", "Pause briefly at the bottom of the movement."],
  },
  {
    id: "lib-bp",
    name: "Bench Press",
    imageUrl: "/images/bench-press-guide.png",
    description: "The classic upper body exercise for building chest, shoulder, and triceps strength.",
    benefits: ["Builds pectoral muscles", "Increases upper body pushing power"],
    instructions: ["Lie on the bench with your feet flat on the floor.", "Grip the bar slightly wider than shoulder-width.", "Lower the bar to your chest, then press it back up forcefully."],
    proTip: "Tuck your elbows at a 45-degree angle to protect your shoulders.",
    commonMistakes: ["Bouncing the bar off your chest.", "Flaring your elbows too wide.", "Lifting your hips off the bench."],
    forBestResults: ["Keep your shoulder blades retracted and down.", "Control the bar path on both the up and down phases."],
  },
  {
    id: "lib-td",
    name: "Tricep Dips",
    imageUrl: "/images/tricep-dips-guide.png",
    description: "A bodyweight exercise that effectively targets the triceps.",
    benefits: ["Builds arm strength and definition", "Requires minimal equipment"],
    instructions: ["Place your hands on a bench or chair behind you.", "Lower your body until your elbows are at a 90-degree angle.", "Push back up to the starting position."],
    proTip: "Keep your hips close to the bench to maximize tricep engagement.",
    commonMistakes: ["Going too low and straining shoulders.", "Flaring elbows out to the sides."],
    forBestResults: ["Focus on the squeeze at the top of the movement.", "Add a weight plate to your lap for extra resistance."],
  },
  {
    id: "lib-ip",
    name: "Incline Press",
    imageUrl: "/images/incline-press-guide.png",
    description: "Targets the upper portion of the pectoral muscles.",
    benefits: ["Develops the upper chest", "Adds variety to your pressing routine"],
    instructions: ["Set the bench to a 30-45 degree incline.", "Perform the press as you would with a flat bench.", "Focus on squeezing your upper chest at the top of the movement."],
    proTip: "Using dumbbells instead of a barbell can improve stabilization and range of motion.",
    commonMistakes: ["Using too steep of an incline, which works the shoulders more.", "Not controlling the weight on the way down."],
    forBestResults: ["Pause for a second at the bottom.", "Don't let the weights touch at the top; keep constant tension."],
  },
];

export const findExerciseGuideById = (id: string): ExerciseGuide | undefined => {
  return mockExerciseGuides.find((guide) => guide.id === id);
};
