// src/mockdata/viewprograms/programFinder.ts

import { findExerciseProgramById, DetailedFitnessTask } from "./mockexerciseprograms";
import { findNutritionProgramById, DetailedNutritionTask } from "./mocknutritionprograms";
// Import future program types here
// import { findMentalHealthProgramById, DetailedMentalHealthTask } from "./mockmentalhealthprograms";

// A union type that includes all possible program structures
export type ProgramData = DetailedFitnessTask | DetailedNutritionTask; // | DetailedMentalHealthTask;

export const findProgramByIdAndType = (
  type: string,
  id: string
): ProgramData | undefined => {
  switch (type) {
    case "fitness":
      return findExerciseProgramById(id);
    case "nutrition":
      return findNutritionProgramById(id);
    // case "mental-health":
    //   return findMentalHealthProgramById(id);
    default:
      return undefined;
  }
};
