export interface NutritionValues {
  calories: number;
  protein: number;
  fiber: number;
  fat: number;
  carbs: number;
}

export interface FoodEntry extends NutritionValues {
  id: string;
  name: string;
  grams?: number;
  source: "manual" | "ai" | "ingredient";
  timestamp: number;
  mealType?: MealType;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type Gender = "male" | "female";

export interface UserProfile {
  heightInches: number;
  weightLbs: number;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  lbsPerWeek: number;
  onboardingComplete: boolean;
}

export interface CalorieRecommendation extends NutritionValues {
  bmr: number;
  tdee: number;
  targetCalories: number;
  deficit: number;
  lbsPerWeek: number;
}

export interface FoodItem {
  id: string;
  name: string;
  per100g: NutritionValues;
  category: string;
}

export interface IngredientInput {
  foodId: string;
  grams: number;
}

export interface AIAnalysisResult {
  foods: Array<{
    name: string;
    estimatedGrams: number;
    calories: number;
    protein: number;
    fiber: number;
    fat: number;
    carbs: number;
    confidence: "high" | "medium" | "low";
  }>;
  total: NutritionValues;
  notes?: string;
  provider?: string;
}
