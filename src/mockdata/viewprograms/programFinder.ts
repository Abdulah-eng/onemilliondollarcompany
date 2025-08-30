// src/mockdata/viewprograms/programFinder.ts

import { findExerciseProgramById, DetailedFitnessTask } from "./mockexerciseprograms";
import { findNutritionProgramById, DetailedNutritionTask } from "./mocknutritionprograms";
import { findMentalHealthProgramById, DetailedMentalHealthTask } from "./mockmentalhealthprograms";

// Add DetailedMentalHealthTask to the union type
export type ProgramData = DetailedFitnessTask | DetailedNutritionTask | DetailedMentalHealthTask;

export const findProgramByIdAndType = (
  type: string,
  id: string
): ProgramData | undefined => {
  switch (type) {
    case "fitness":
      return findExerciseProgramById(id);
    case "nutrition":
      return findNutritionProgramById(id);
    // Add the new case for mental health
    case "mental":
      return findMentalHealthProgramById(id);
    default:
      return undefined;
  }
};
