"use client";

import { Dumbbell, Scale, TrendingDown } from "lucide-react";
import type { CalorieRecommendation, GoalMode } from "@/lib/types";

const RATE_OPTIONS = [0.5, 1, 1.5, 2];

interface GoalSelectorProps {
  goalMode: GoalMode;
  lbsPerWeek: number;
  recommendation: CalorieRecommendation;
  onChange: (goalMode: GoalMode, lbsPerWeek: number) => void;
  compact?: boolean;
}

export function GoalSelector({
  goalMode,
  lbsPerWeek,
  recommendation,
  onChange,
  compact = false,
}: GoalSelectorProps) {
  const selectMode = (mode: GoalMode) => {
    if (mode === "maintain") {
      onChange("maintain", 0);
    } else if (mode === "lose") {
      onChange("lose", lbsPerWeek > 0 ? lbsPerWeek : 1);
    } else {
      onChange("bulk", lbsPerWeek > 0 ? lbsPerWeek : 0.5);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => selectMode("maintain")}
          className={`chip flex flex-col items-center gap-2 py-4 ${goalMode === "maintain" ? "chip-active" : ""}`}
        >
          <Scale className="h-5 w-5" />
          <div>
            <p className="font-bold">Maintain</p>
            <p className="text-xs text-slate-500">Track macros</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => selectMode("lose")}
          className={`chip flex flex-col items-center gap-2 py-4 ${goalMode === "lose" ? "chip-active" : ""}`}
        >
          <TrendingDown className="h-5 w-5" />
          <div>
            <p className="font-bold">Lose</p>
            <p className="text-xs text-slate-500">Calorie deficit</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => selectMode("bulk")}
          className={`chip flex flex-col items-center gap-2 py-4 ${goalMode === "bulk" ? "chip-active" : ""}`}
        >
          <Dumbbell className="h-5 w-5" />
          <div>
            <p className="font-bold">Bulk</p>
            <p className="text-xs text-slate-500">Build muscle</p>
          </div>
        </button>
      </div>

      {goalMode === "lose" && (
        <>
          <div>
            <p className="label">How much to lose per week?</p>
            <div
              className={`grid gap-2 ${compact ? "grid-cols-4" : "grid-cols-2"}`}
            >
              {RATE_OPTIONS.map((lbs) => (
                <button
                  key={lbs}
                  type="button"
                  onClick={() => onChange("lose", lbs)}
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

      {goalMode === "bulk" && (
        <>
          <div>
            <p className="label">How much to gain per week?</p>
            <div
              className={`grid gap-2 ${compact ? "grid-cols-4" : "grid-cols-2"}`}
            >
              {RATE_OPTIONS.map((lbs) => (
                <button
                  key={lbs}
                  type="button"
                  onClick={() => onChange("bulk", lbs)}
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
              {recommendation.surplus} kcal
            </strong>{" "}
            daily surplus to support muscle growth.
          </div>
        </>
      )}

      {goalMode === "maintain" && (
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
