import type {
  ActivityLevel,
  CalorieRecommendation,
  GoalMode,
  NutritionValues,
  UserProfile,
} from "./types";
import { inchesToCm, lbsToKg } from "./units";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const CALORIES_PER_LB = 3500;

export function calculateBMR(profile: UserProfile): number {
  const weightKg = lbsToKg(profile.weightLbs);
  const heightCm = inchesToCm(profile.heightInches);
  const { age, gender } = profile;

  if (gender === "male") {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile);
  return bmr * ACTIVITY_MULTIPLIERS[profile.activityLevel];
}

export function getDailyCalorieAdjustment(lbsPerWeek: number): number {
  if (lbsPerWeek <= 0) return 0;
  return Math.round((lbsPerWeek * CALORIES_PER_LB) / 7);
}

export function inferGoalMode(
  raw: Record<string, unknown>
): GoalMode {
  if (raw.goalMode === "lose" || raw.goalMode === "maintain" || raw.goalMode === "bulk") {
    return raw.goalMode;
  }
  const lbs = Number(raw.lbsPerWeek ?? 0);
  if (lbs > 0) return "lose";
  return "maintain";
}

export function getCalorieRecommendation(
  profile: UserProfile
): CalorieRecommendation {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(profile);
  const adjustment = getDailyCalorieAdjustment(profile.lbsPerWeek);

  let targetCalories: number;
  let deficit = 0;
  let surplus = 0;

  switch (profile.goalMode) {
    case "bulk":
      surplus = adjustment || 300;
      targetCalories = tdee + surplus;
      break;
    case "lose":
      deficit = adjustment || 500;
      targetCalories = Math.max(tdee - deficit, bmr * 1.1);
      break;
    default:
      targetCalories = tdee;
  }

  const proteinPerKg =
    profile.goalMode === "lose" ? 2.0 : profile.goalMode === "bulk" ? 2.2 : 1.6;
  const protein = Math.round(lbsToKg(profile.weightLbs) * proteinPerKg);
  const fat = Math.round((targetCalories * 0.25) / 9);
  const fiber = profile.gender === "male" ? 38 : 25;
  const proteinCal = protein * 4;
  const fatCal = fat * 9;
  const carbs = Math.round((targetCalories - proteinCal - fatCal) / 4);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    goalMode: profile.goalMode,
    deficit,
    surplus,
    lbsPerWeek: profile.lbsPerWeek,
    calories: Math.round(targetCalories),
    protein,
    fiber,
    fat,
    carbs: Math.max(carbs, 0),
  };
}

export function sumNutrition(entries: NutritionValues[]): NutritionValues {
  return entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      fiber: acc.fiber + entry.fiber,
      fat: acc.fat + entry.fat,
      carbs: acc.carbs + entry.carbs,
    }),
    { calories: 0, protein: 0, fiber: 0, fat: 0, carbs: 0 }
  );
}

export function scaleNutrition(
  per100g: NutritionValues,
  grams: number
): NutritionValues {
  const factor = grams / 100;
  return {
    calories: Math.round(per100g.calories * factor),
    protein: Math.round(per100g.protein * factor * 10) / 10,
    fiber: Math.round(per100g.fiber * factor * 10) / 10,
    fat: Math.round(per100g.fat * factor * 10) / 10,
    carbs: Math.round(per100g.carbs * factor * 10) / 10,
  };
}

export function getActivityLabel(level: ActivityLevel): string {
  const labels: Record<ActivityLevel, string> = {
    sedentary: "Sedentary (little or no exercise)",
    light: "Light (1-3 days/week)",
    moderate: "Moderate (3-5 days/week)",
    active: "Active (6-7 days/week)",
    very_active: "Very Active (athlete/physical job)",
  };
  return labels[level];
}

export function getGoalLabel(goalMode: GoalMode): string {
  const labels: Record<GoalMode, string> = {
    lose: "Lose weight",
    maintain: "Maintain weight",
    bulk: "Bulk up",
  };
  return labels[goalMode];
}
