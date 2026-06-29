"use client";

import { Dumbbell, Flame, Scale, Sparkles, TrendingDown } from "lucide-react";
import type { CalorieRecommendation, FoodEntry, NutritionValues } from "@/lib/types";
import { MACRO_CONFIG } from "@/hooks/useTracker";
import { MacroRing } from "./MacroRing";
import { MacroBar } from "./MacroBar";
import { FoodLog } from "./FoodLog";

interface DashboardProps {
  todayTotals: NutritionValues;
  recommendation: CalorieRecommendation;
  todayEntries: FoodEntry[];
  onRemoveEntry: (id: string) => void;
}

export function Dashboard({
  todayTotals,
  recommendation,
  todayEntries,
  onRemoveEntry,
}: DashboardProps) {
  const caloriePercent = Math.min(
    Math.round((todayTotals.calories / recommendation.targetCalories) * 100),
    100
  );
  const remaining = Math.max(
    recommendation.targetCalories - todayTotals.calories,
    0
  );

  return (
    <div className="space-y-5">
      <div className="hero-card">
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-brand-100">
                Today&apos;s Calories
              </p>
              <p className="mt-1 text-5xl font-bold tracking-tight">
                {Math.round(todayTotals.calories)}
              </p>
              <p className="mt-1 text-brand-100">
                of {recommendation.targetCalories} kcal goal
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3.5 backdrop-blur-sm">
              <Flame className="h-7 w-7 text-accent-300" />
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex justify-between text-xs font-medium text-brand-100">
              <span>{caloriePercent}% of goal</span>
              <span>{remaining} kcal remaining</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-400 to-accent-300 transition-all duration-700 ease-out"
                style={{ width: `${caloriePercent}%` }}
              />
            </div>
          </div>

          {recommendation.goalMode === "maintain" ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-brand-50 backdrop-blur-sm">
              <Scale className="h-3.5 w-3.5" />
              Maintain weight · track macros
            </div>
          ) : recommendation.goalMode === "bulk" ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-brand-50 backdrop-blur-sm">
              <Dumbbell className="h-3.5 w-3.5" />
              Gain {recommendation.lbsPerWeek} lb/week ·{" "}
              {recommendation.surplus} kcal surplus
            </div>
          ) : (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-brand-50 backdrop-blur-sm">
              <TrendingDown className="h-3.5 w-3.5" />
              Lose {recommendation.lbsPerWeek} lb/week ·{" "}
              {recommendation.deficit} kcal deficit
            </div>
          )}
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-500" />
          <h3 className="section-label">Macro Progress</h3>
        </div>
        <div className="flex justify-between gap-2">
          {(Object.keys(MACRO_CONFIG) as Array<keyof typeof MACRO_CONFIG>)
            .filter((k) => k !== "calories")
            .map((key) => (
              <MacroRing
                key={key}
                label={MACRO_CONFIG[key].label}
                current={todayTotals[key]}
                target={recommendation[key]}
                unit={MACRO_CONFIG[key].unit}
                ringColor={MACRO_CONFIG[key].ring}
                barColor={MACRO_CONFIG[key].color}
              />
            ))}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="mb-4 text-sm font-bold text-slate-800">
          Detailed Breakdown
        </h3>
        <div className="space-y-4">
          {(Object.keys(MACRO_CONFIG) as Array<keyof typeof MACRO_CONFIG>).map(
            (key) => (
              <MacroBar
                key={key}
                label={MACRO_CONFIG[key].label}
                current={todayTotals[key]}
                target={recommendation[key]}
                unit={MACRO_CONFIG[key].unit}
                color={MACRO_CONFIG[key].color}
              />
            )
          )}
        </div>
      </div>

      <FoodLog entries={todayEntries} onRemove={onRemoveEntry} />
    </div>
  );
}
