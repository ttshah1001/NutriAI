"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { getFoodById, searchFoods } from "@/lib/food-database";
import { scaleNutrition } from "@/lib/nutrition";
import type { IngredientInput } from "@/lib/types";

interface IngredientTrackerProps {
  onAddMeal: (
    name: string,
    ingredients: Array<{
      name: string;
      grams: number;
      calories: number;
      protein: number;
      fiber: number;
      fat: number;
      carbs: number;
    }>
  ) => void;
}

export function IngredientTracker({ onAddMeal }: IngredientTrackerProps) {
  const [search, setSearch] = useState("");
  const [ingredients, setIngredients] = useState<IngredientInput[]>([]);
  const [gramsInput, setGramsInput] = useState<Record<string, string>>({});
  const [mealName, setMealName] = useState("");

  const filteredFoods = useMemo(() => searchFoods(search).slice(0, 8), [search]);

  const ingredientDetails = useMemo(() => {
    return ingredients
      .map((ing) => {
        const food = getFoodById(ing.foodId);
        if (!food) return null;
        const nutrition = scaleNutrition(food.per100g, ing.grams);
        return { food, grams: ing.grams, nutrition };
      })
      .filter(Boolean) as Array<{
      food: ReturnType<typeof getFoodById> & object;
      grams: number;
      nutrition: ReturnType<typeof scaleNutrition>;
    }>;
  }, [ingredients]);

  const totals = ingredientDetails.reduce(
    (acc, item) => ({
      calories: acc.calories + item.nutrition.calories,
      protein: acc.protein + item.nutrition.protein,
      fiber: acc.fiber + item.nutrition.fiber,
      fat: acc.fat + item.nutrition.fat,
      carbs: acc.carbs + item.nutrition.carbs,
    }),
    { calories: 0, protein: 0, fiber: 0, fat: 0, carbs: 0 }
  );

  const addIngredient = (foodId: string) => {
    const grams = Number(gramsInput[foodId] || 100);
    if (grams <= 0) return;

    setIngredients((prev) => {
      const existing = prev.find((i) => i.foodId === foodId);
      if (existing) {
        return prev.map((i) =>
          i.foodId === foodId ? { ...i, grams: i.grams + grams } : i
        );
      }
      return [...prev, { foodId, grams }];
    });
    setSearch("");
    setGramsInput((prev) => ({ ...prev, [foodId]: "100" }));
  };

  const removeIngredient = (foodId: string) => {
    setIngredients((prev) => prev.filter((i) => i.foodId !== foodId));
  };

  const handleSubmit = () => {
    if (ingredientDetails.length === 0) return;

    const name =
      mealName.trim() ||
      ingredientDetails.map((i) => i.food.name).join(" + ");

    onAddMeal(
      name,
      ingredientDetails.map((i) => ({
        name: i.food.name,
        grams: i.grams,
        ...i.nutrition,
      }))
    );

    setIngredients([]);
    setMealName("");
    setSearch("");
  };

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <h3 className="mb-4 font-bold text-slate-800">Add Ingredients</h3>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search foods (chicken, rice, avocado...)"
            className="input py-2.5 pl-10"
          />
        </div>

        {search && filteredFoods.length > 0 && (
          <ul className="card-muted mb-4 divide-y divide-slate-100 overflow-hidden">
            {filteredFoods.map((food) => (
              <li
                key={food.id}
                className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-white"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {food.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {food.per100g.calories} kcal/100g · P {food.per100g.protein}
                    g · C {food.per100g.carbs}g
                  </p>
                </div>
                <input
                  type="number"
                  value={gramsInput[food.id] ?? "100"}
                  onChange={(e) =>
                    setGramsInput((prev) => ({
                      ...prev,
                      [food.id]: e.target.value,
                    }))
                  }
                  min={1}
                  className="input w-16 px-2 py-1 text-center"
                  aria-label={`Grams for ${food.name}`}
                />
                <span className="text-xs text-slate-400">g</span>
                <button
                  onClick={() => addIngredient(food.id)}
                  className="rounded-xl bg-brand-600 p-2 text-white shadow-sm transition-all hover:bg-brand-700 active:scale-95"
                  aria-label={`Add ${food.name}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {ingredients.length > 0 && (
          <div className="space-y-3">
            <input
              type="text"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="Meal name (optional, e.g. Post-workout bowl)"
              className="input"
            />

            <ul className="card-muted divide-y divide-slate-100 overflow-hidden">
              {ingredientDetails.map((item) => (
                <li
                  key={item.food.id}
                  className="flex items-center gap-3 px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {item.food.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.grams}g · {item.nutrition.calories} kcal
                    </p>
                  </div>
                  <input
                    type="number"
                    value={item.grams}
                    onChange={(e) => {
                      const g = Number(e.target.value);
                      setIngredients((prev) =>
                        prev.map((i) =>
                          i.foodId === item.food.id ? { ...i, grams: g } : i
                        )
                      );
                    }}
                    min={1}
                    className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-center text-sm"
                    aria-label={`Adjust grams for ${item.food.name}`}
                  />
                  <span className="text-xs text-gray-500">g</span>
                  <button
                    onClick={() => removeIngredient(item.food.id)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    aria-label={`Remove ${item.food.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="card-muted p-4 text-sm">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Meal Total</span>
                <span className="text-accent-600">{totals.calories} kcal</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                P {Math.round(totals.protein * 10) / 10}g · C{" "}
                {Math.round(totals.carbs * 10) / 10}g · F{" "}
                {Math.round(totals.fat * 10) / 10}g · Fiber{" "}
                {Math.round(totals.fiber * 10) / 10}g
              </p>
            </div>

            <button onClick={handleSubmit} className="btn-primary w-full">
              <Plus className="h-4 w-4" />
              Log Meal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
