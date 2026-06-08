"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { NutritionValues } from "@/lib/types";

interface ManualEntryProps {
  onAdd: (
    name: string,
    nutrition: NutritionValues,
    grams?: number
  ) => void;
}

const EMPTY: NutritionValues = {
  calories: 0,
  protein: 0,
  fiber: 0,
  fat: 0,
  carbs: 0,
};

const FIELD_COLORS: Record<keyof NutritionValues, string> = {
  calories: "focus:ring-accent-500/20 focus:border-accent-400",
  protein: "focus:ring-sky-500/20 focus:border-sky-400",
  carbs: "focus:ring-violet-500/20 focus:border-violet-400",
  fat: "focus:ring-amber-500/20 focus:border-amber-400",
  fiber: "focus:ring-emerald-500/20 focus:border-emerald-400",
};

export function ManualEntry({ onAdd }: ManualEntryProps) {
  const [name, setName] = useState("");
  const [grams, setGrams] = useState("");
  const [nutrition, setNutrition] = useState<NutritionValues>(EMPTY);

  const updateMacro = (key: keyof NutritionValues, value: string) => {
    setNutrition((prev) => ({ ...prev, [key]: Number(value) || 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), nutrition, grams ? Number(grams) : undefined);
    setName("");
    setGrams("");
    setNutrition(EMPTY);
  };

  const fields: Array<{
    key: keyof NutritionValues;
    label: string;
    unit: string;
  }> = [
    { key: "calories", label: "Calories", unit: "kcal" },
    { key: "protein", label: "Protein", unit: "g" },
    { key: "carbs", label: "Carbs", unit: "g" },
    { key: "fat", label: "Fat", unit: "g" },
    { key: "fiber", label: "Fiber", unit: "g" },
  ];

  return (
    <form onSubmit={handleSubmit} className="card p-5">
      <h3 className="font-bold text-slate-800">Manual Entry</h3>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Food Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Homemade smoothie"
            required
            className="input"
          />
        </div>

        <div>
          <label className="label">Portion (grams, optional)</label>
          <input
            type="number"
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
            placeholder="e.g. 250"
            min={0}
            className="input"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {fields.map(({ key, label, unit }) => (
          <div key={key}>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              {label} ({unit})
            </label>
            <input
              type="number"
              value={nutrition[key] || ""}
              onChange={(e) => updateMacro(key, e.target.value)}
              min={0}
              step={key === "calories" ? 1 : 0.1}
              className={`input py-2 ${FIELD_COLORS[key]}`}
            />
          </div>
        ))}
      </div>

      <button type="submit" className="btn-primary mt-5 w-full">
        <Plus className="h-4 w-4" />
        Add to Log
      </button>
    </form>
  );
}
