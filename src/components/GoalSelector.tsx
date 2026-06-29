"use client";

import { Scale, TrendingDown } from "lucide-react";
import type { CalorieRecommendation } from "@/lib/types";
import { isMaintainingWeight } from "@/lib/nutrition";

const LBS_OPTIONS = [0.5, 1, 1.5, 2];

interface GoalSelectorProps {
  lbsPerWeek: number;
  recommendation: CalorieRecommendation;
  onChange: (lbsPerWeek: number) => void;
  compact?: boolean;
}

export function GoalSelector({
  lbsPerWeek,
  recommendation,
  onChange,
  compact = false,
}: GoalSelectorProps) {
  const maintaining = isMaintainingWeight(lbsPerWeek);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange(0)}
          className={`chip flex flex-col items-center gap-2 py-4 ${maintaining ? "chip-active" : ""}`}
        >
          <Scale className="h-6 w-6" />
          <div>
            <p className="font-bold">Maintain</p>
            <p className="text-xs text-slate-500">Track macros</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => onChange(lbsPerWeek > 0 ? lbsPerWeek : 1)}
          className={`chip flex flex-col items-center gap-2 py-4 ${!maintaining ? "chip-active" : ""}`}
        >
          <TrendingDown className="h-6 w-6" />
          <div>
            <p className="font-bold">Lose Weight</p>
            <p className="text-xs text-slate-500">Calorie deficit</p>
          </div>
        </button>
      </div>

      {!maintaining && (
        <>
          <div>
            <p className="label">How much per week?</p>
            <div
              className={`grid gap-2 ${compact ? "grid-cols-4" : "grid-cols-2"}`}
            >
              {LBS_OPTIONS.map((lbs) => (
                <button
                  key={lbs}
                  type="button"
                  onClick={() => onChange(lbs)}
                  className={`chip ${lbsPerWeek === lbs ? "chip-active" : ""} ${compact ? "py-2.5 text-sm" : ""}`}
                >
                  {compact ? (
                    `${lbs} lb`
                  ) : (
                    <>
                      <p className="text-3xl font-bold">{lbs}</p>
                      <p className="mt-0.5 text-xs text-slate-500">lbs / week</p>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="card-muted p-4 text-sm text-slate-600">
            At <strong className="text-brand-700">{lbsPerWeek} lb/week</strong>,
            you need a{" "}
            <strong className="text-brand-700">
              {recommendation.deficit} kcal
            </strong>{" "}
            daily deficit.
          </div>
        </>
      )}

      {maintaining && (
        <div className="card-muted p-4 text-sm text-slate-600">
          Your calorie target is set to your maintenance level (
          <strong className="text-brand-700">
            {recommendation.targetCalories} kcal/day
          </strong>
          ) so you can focus on hitting your protein, carbs, fat, and fiber
          goals.
        </div>
      )}
    </div>
  );
}
