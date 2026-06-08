import type { FoodItem } from "./types";

export const FOOD_DATABASE: FoodItem[] = [
  {
    id: "chicken-breast",
    name: "Chicken Breast",
    category: "Protein",
    per100g: { calories: 165, protein: 31, fiber: 0, fat: 3.6, carbs: 0 },
  },
  {
    id: "salmon",
    name: "Salmon",
    category: "Protein",
    per100g: { calories: 208, protein: 20, fiber: 0, fat: 13, carbs: 0 },
  },
  {
    id: "eggs",
    name: "Eggs (whole)",
    category: "Protein",
    per100g: { calories: 155, protein: 13, fiber: 0, fat: 11, carbs: 1.1 },
  },
  {
    id: "greek-yogurt",
    name: "Greek Yogurt",
    category: "Dairy",
    per100g: { calories: 97, protein: 9, fiber: 0, fat: 5, carbs: 3.6 },
  },
  {
    id: "tofu",
    name: "Tofu",
    category: "Protein",
    per100g: { calories: 76, protein: 8, fiber: 0.3, fat: 4.8, carbs: 1.9 },
  },
  {
    id: "brown-rice",
    name: "Brown Rice (cooked)",
    category: "Grains",
    per100g: { calories: 112, protein: 2.6, fiber: 1.8, fat: 0.9, carbs: 24 },
  },
  {
    id: "white-rice",
    name: "White Rice (cooked)",
    category: "Grains",
    per100g: { calories: 130, protein: 2.7, fiber: 0.4, fat: 0.3, carbs: 28 },
  },
  {
    id: "oats",
    name: "Oats (dry)",
    category: "Grains",
    per100g: { calories: 389, protein: 17, fiber: 10.6, fat: 6.9, carbs: 66 },
  },
  {
    id: "quinoa",
    name: "Quinoa (cooked)",
    category: "Grains",
    per100g: { calories: 120, protein: 4.4, fiber: 2.8, fat: 1.9, carbs: 21 },
  },
  {
    id: "whole-wheat-bread",
    name: "Whole Wheat Bread",
    category: "Grains",
    per100g: { calories: 247, protein: 13, fiber: 7, fat: 3.4, carbs: 41 },
  },
  {
    id: "pasta",
    name: "Pasta (cooked)",
    category: "Grains",
    per100g: { calories: 131, protein: 5, fiber: 1.8, fat: 1.1, carbs: 25 },
  },
  {
    id: "broccoli",
    name: "Broccoli",
    category: "Vegetables",
    per100g: { calories: 34, protein: 2.8, fiber: 2.6, fat: 0.4, carbs: 7 },
  },
  {
    id: "spinach",
    name: "Spinach",
    category: "Vegetables",
    per100g: { calories: 23, protein: 2.9, fiber: 2.2, fat: 0.4, carbs: 3.6 },
  },
  {
    id: "sweet-potato",
    name: "Sweet Potato",
    category: "Vegetables",
    per100g: { calories: 86, protein: 1.6, fiber: 3, fat: 0.1, carbs: 20 },
  },
  {
    id: "banana",
    name: "Banana",
    category: "Fruits",
    per100g: { calories: 89, protein: 1.1, fiber: 2.6, fat: 0.3, carbs: 23 },
  },
  {
    id: "apple",
    name: "Apple",
    category: "Fruits",
    per100g: { calories: 52, protein: 0.3, fiber: 2.4, fat: 0.2, carbs: 14 },
  },
  {
    id: "avocado",
    name: "Avocado",
    category: "Fruits",
    per100g: { calories: 160, protein: 2, fiber: 6.7, fat: 15, carbs: 9 },
  },
  {
    id: "blueberries",
    name: "Blueberries",
    category: "Fruits",
    per100g: { calories: 57, protein: 0.7, fiber: 2.4, fat: 0.3, carbs: 14 },
  },
  {
    id: "almonds",
    name: "Almonds",
    category: "Nuts",
    per100g: { calories: 579, protein: 21, fiber: 12.5, fat: 50, carbs: 22 },
  },
  {
    id: "peanut-butter",
    name: "Peanut Butter",
    category: "Nuts",
    per100g: { calories: 588, protein: 25, fiber: 6, fat: 50, carbs: 20 },
  },
  {
    id: "olive-oil",
    name: "Olive Oil",
    category: "Fats",
    per100g: { calories: 884, protein: 0, fiber: 0, fat: 100, carbs: 0 },
  },
  {
    id: "cheddar-cheese",
    name: "Cheddar Cheese",
    category: "Dairy",
    per100g: { calories: 403, protein: 25, fiber: 0, fat: 33, carbs: 1.3 },
  },
  {
    id: "milk",
    name: "Milk (2%)",
    category: "Dairy",
    per100g: { calories: 50, protein: 3.3, fiber: 0, fat: 2, carbs: 5 },
  },
  {
    id: "black-beans",
    name: "Black Beans (cooked)",
    category: "Legumes",
    per100g: { calories: 132, protein: 8.9, fiber: 8.7, fat: 0.5, carbs: 24 },
  },
  {
    id: "lentils",
    name: "Lentils (cooked)",
    category: "Legumes",
    per100g: { calories: 116, protein: 9, fiber: 7.9, fat: 0.4, carbs: 20 },
  },
  {
    id: "ground-beef",
    name: "Ground Beef (lean)",
    category: "Protein",
    per100g: { calories: 250, protein: 26, fiber: 0, fat: 15, carbs: 0 },
  },
  {
    id: "turkey",
    name: "Turkey Breast",
    category: "Protein",
    per100g: { calories: 135, protein: 30, fiber: 0, fat: 1, carbs: 0 },
  },
  {
    id: "shrimp",
    name: "Shrimp",
    category: "Protein",
    per100g: { calories: 99, protein: 24, fiber: 0, fat: 0.3, carbs: 0.2 },
  },
  {
    id: "protein-powder",
    name: "Whey Protein Powder",
    category: "Supplements",
    per100g: { calories: 400, protein: 80, fiber: 0, fat: 5, carbs: 10 },
  },
  {
    id: "protein-bar",
    name: "Protein Bar",
    category: "Snacks",
    per100g: { calories: 350, protein: 30, fiber: 5, fat: 12, carbs: 35 },
  },
];

export function searchFoods(query: string): FoodItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return FOOD_DATABASE;
  return FOOD_DATABASE.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
  );
}

export function getFoodById(id: string): FoodItem | undefined {
  return FOOD_DATABASE.find((f) => f.id === id);
}
