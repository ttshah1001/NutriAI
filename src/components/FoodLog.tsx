"use client";

import { Camera, PenLine, Trash2, Utensils, Wheat } from "lucide-react";
import type { FoodEntry } from "@/lib/types";

interface FoodLogProps {
  entries: FoodEntry[];
  onRemove: (id: string) => void;
}

const SOURCE_CONFIG = {
  ai: { icon: Camera, label: "AI Scan", color: "bg-brand-100 text-brand-700" },
  manual: {
    icon: PenLine,
    label: "Manual",
    color: "bg-violet-100 text-violet-700",
  },
  ingredient: {
    icon: Wheat,
    label: "Ingredient",
    color: "bg-amber-100 text-amber-700",
  },
};

export function FoodLog({ entries, onRemove }: FoodLogProps) {
  if (entries.length === 0) {
    return (
      <div className="card flex flex-col items-center px-6 py-10 text-center">
        <div className="mb-4 rounded-2xl bg-brand-50 p-4">
          <Utensils className="h-8 w-8 text-brand-500" />
        </div>
        <p className="font-semibold text-slate-700">No food logged yet</p>
        <p className="mt-1 max-w-xs text-sm text-slate-400">
          Scan a meal, add ingredients, or enter manually to start tracking.
        </p>
      </div>
    );
  }

  const sorted = [...entries].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3.5">
        <h3 className="text-sm font-bold text-slate-800">
          Today&apos;s Log
          <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">
            {entries.length}
          </span>
        </h3>
      </div>
      <ul className="divide-y divide-slate-50">
        {sorted.map((entry) => {
          const config = SOURCE_CONFIG[entry.source];
          const Icon = config.icon;
          return (
            <li
              key={entry.id}
              className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-slate-50/80"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <Icon className="h-4 w-4 text-slate-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-800">
                  {entry.name}
                  {entry.grams ? (
                    <span className="ml-1 font-normal text-slate-400">
                      · {entry.grams}g
                    </span>
                  ) : null}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  <span className="font-medium text-accent-600">
                    {entry.calories} kcal
                  </span>
                  {" · "}P {entry.protein}g · C {entry.carbs}g · F {entry.fat}
                  g · Fiber {entry.fiber}g
                </p>
              </div>
              <span
                className={`hidden shrink-0 rounded-lg px-2 py-1 text-[10px] font-semibold sm:inline ${config.color}`}
              >
                {config.label}
              </span>
              <button
                onClick={() => onRemove(entry.id)}
                className="shrink-0 rounded-xl p-2 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
                aria-label={`Remove ${entry.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
