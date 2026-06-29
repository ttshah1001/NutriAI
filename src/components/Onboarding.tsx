"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  Target,
  User,
} from "lucide-react";
import { getActivityLabel, getCalorieRecommendation, isMaintainingWeight } from "@/lib/nutrition";
import { EMPTY_PROFILE } from "@/lib/storage";
import { feetInchesToInches, inchesToFeetInches } from "@/lib/units";
import type {
  ActivityLevel,
  CalorieRecommendation,
  Gender,
  UserProfile,
} from "@/lib/types";
import { GoalSelector } from "./GoalSelector";
import { NumberField } from "./NumberField";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

type Step = "about" | "goal" | "summary";

const STEPS = ["About You", "Your Goal", "Your Targets"];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<Step>("about");
  const initial = inchesToFeetInches(EMPTY_PROFILE.heightInches);

  const [gender, setGender] = useState<Gender>(EMPTY_PROFILE.gender);
  const [age, setAge] = useState(EMPTY_PROFILE.age);
  const [feet, setFeet] = useState(initial.feet);
  const [inches, setInches] = useState(initial.inches);
  const [weightLbs, setWeightLbs] = useState(EMPTY_PROFILE.weightLbs);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    EMPTY_PROFILE.activityLevel
  );
  const [lbsPerWeek, setLbsPerWeek] = useState(EMPTY_PROFILE.lbsPerWeek);

  const draftProfile = useMemo(
    (): UserProfile => ({
      heightInches: feetInchesToInches(feet, inches),
      weightLbs,
      age,
      gender,
      activityLevel,
      lbsPerWeek,
      onboardingComplete: false,
    }),
    [feet, inches, weightLbs, age, gender, activityLevel, lbsPerWeek]
  );

  const recommendation = useMemo(
    () => getCalorieRecommendation(draftProfile),
    [draftProfile]
  );

  const stepIndex = step === "about" ? 0 : step === "goal" ? 1 : 2;

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-hero-gradient text-2xl font-bold text-white shadow-elevated">
          N
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Welcome to NutriAI
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Set up your profile and we&apos;ll calculate your daily goals
        </p>
      </div>

      <div className="mb-8 flex items-center justify-center gap-1">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  i <= stepIndex
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-[10px] font-semibold ${i <= stepIndex ? "text-brand-700" : "text-slate-400"}`}
              >
                {label}
              </span>
            </div>
            {i < 2 && (
              <div
                className={`mx-2 mb-5 h-0.5 w-10 rounded-full transition-colors ${i < stepIndex ? "bg-brand-400" : "bg-slate-200"}`}
              />
            )}
          </div>
        ))}
      </div>

      {step === "about" && (
        <div className="card space-y-4 p-6">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-brand-50 p-2">
              <User className="h-5 w-5 text-brand-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Tell us about yourself
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="input"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="label">Age</label>
              <NumberField
                value={age}
                onChange={setAge}
                min={15}
                max={100}
              />
            </div>

            <div>
              <label className="label">Height</label>
              <div className="flex gap-2">
                <div className="flex flex-1 items-center gap-1.5">
                  <NumberField
                    value={feet}
                    onChange={setFeet}
                    min={4}
                    max={7}
                    aria-label="Height feet"
                  />
                  <span className="text-sm text-slate-400">ft</span>
                </div>
                <div className="flex flex-1 items-center gap-1.5">
                  <NumberField
                    value={inches}
                    onChange={setInches}
                    min={0}
                    max={11}
                    aria-label="Height inches"
                  />
                  <span className="text-sm text-slate-400">in</span>
                </div>
              </div>
            </div>

            <div>
              <label className="label">Weight (lbs)</label>
              <NumberField
                value={weightLbs}
                onChange={setWeightLbs}
                min={80}
                max={500}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="label">Activity Level</label>
              <select
                value={activityLevel}
                onChange={(e) =>
                  setActivityLevel(e.target.value as ActivityLevel)
                }
                className="input"
              >
                {(
                  [
                    "sedentary",
                    "light",
                    "moderate",
                    "active",
                    "very_active",
                  ] as ActivityLevel[]
                ).map((level) => (
                  <option key={level} value={level}>
                    {getActivityLabel(level)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => setStep("goal")}
            className="btn-primary mt-2 w-full"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {step === "goal" && (
        <div className="card space-y-4 p-6">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-accent-50 p-2">
              <Target className="h-5 w-5 text-accent-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              What&apos;s your goal?
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            Lose weight with a calorie deficit, or maintain and focus on hitting
            your macros.
          </p>

          <GoalSelector
            lbsPerWeek={lbsPerWeek}
            recommendation={recommendation}
            onChange={setLbsPerWeek}
          />

          <div className="flex gap-2">
            <button
              onClick={() => setStep("about")}
              className="btn-secondary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={() => setStep("summary")}
              className="btn-primary flex-1"
            >
              See My Goals
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === "summary" && (
        <GoalSummary
          recommendation={recommendation}
          lbsPerWeek={lbsPerWeek}
          onBack={() => setStep("goal")}
          onComplete={() =>
            onComplete({ ...draftProfile, onboardingComplete: true })
          }
        />
      )}
    </div>
  );
}

function GoalSummary({
  recommendation,
  lbsPerWeek,
  onBack,
  onComplete,
}: {
  recommendation: CalorieRecommendation;
  lbsPerWeek: number;
  onBack: () => void;
  onComplete: () => void;
}) {
  const macros = [
    { label: "Protein", value: recommendation.protein, color: "text-sky-600" },
    { label: "Carbs", value: recommendation.carbs, color: "text-violet-600" },
    { label: "Fat", value: recommendation.fat, color: "text-amber-600" },
    { label: "Fiber", value: recommendation.fiber, color: "text-emerald-600" },
  ];

  return (
    <div className="space-y-4">
      <div className="hero-card">
        <div className="relative">
          <div className="mb-2 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-brand-200" />
            <h2 className="text-lg font-bold">Your Daily Goal</h2>
          </div>
          <p className="text-6xl font-bold tracking-tight">
            {recommendation.targetCalories}
          </p>
          <p className="text-brand-100">calories per day</p>
          {isMaintainingWeight(lbsPerWeek) ? (
            <p className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-sm text-brand-50">
              Maintain weight · focus on macros
            </p>
          ) : (
            <p className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-sm text-brand-50">
              Lose {lbsPerWeek} lb/week · {recommendation.deficit} kcal deficit
            </p>
          )}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="section-label mb-4">Daily Macro Targets</h3>
        <div className="grid grid-cols-2 gap-3">
          {macros.map(({ label, value, color }) => (
            <div key={label} className="card-muted p-4 text-center">
              <p className="text-xs font-semibold text-slate-400">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>
                {value}
                <span className="text-sm font-medium text-slate-400">g</span>
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-500">
          {isMaintainingWeight(lbsPerWeek)
            ? `Based on your stats, ${recommendation.targetCalories} kcal/day keeps you at maintenance while you track macros.`
            : `Protein is set at ${recommendation.protein}g to help preserve muscle while you lose weight.`}
        </p>
      </div>

      <div className="flex gap-2">
        <button onClick={onBack} className="btn-secondary">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button onClick={onComplete} className="btn-primary flex-1">
          Start Tracking Food
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
