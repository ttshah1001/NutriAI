"use client";

import { useMemo, useState } from "react";
import { Calculator, Save } from "lucide-react";
import { getActivityLabel, getCalorieRecommendation } from "@/lib/nutrition";
import { feetInchesToInches, inchesToFeetInches } from "@/lib/units";
import type { ActivityLevel, Gender, UserProfile } from "@/lib/types";

interface ProfileSetupProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const LBS_OPTIONS = [0.5, 1, 1.5, 2];

export function ProfileSetup({ profile, onSave }: ProfileSetupProps) {
  const { feet: initFeet, inches: initInches } = inchesToFeetInches(
    profile.heightInches
  );

  const [gender, setGender] = useState(profile.gender);
  const [age, setAge] = useState(profile.age);
  const [feet, setFeet] = useState(initFeet);
  const [inches, setInches] = useState(initInches);
  const [weightLbs, setWeightLbs] = useState(profile.weightLbs);
  const [activityLevel, setActivityLevel] = useState(profile.activityLevel);
  const [lbsPerWeek, setLbsPerWeek] = useState(profile.lbsPerWeek);
  const [saved, setSaved] = useState(false);

  const draftProfile = useMemo(
    (): UserProfile => ({
      heightInches: feetInchesToInches(feet, inches),
      weightLbs,
      age,
      gender,
      activityLevel,
      lbsPerWeek,
      onboardingComplete: true,
    }),
    [feet, inches, weightLbs, age, gender, activityLevel, lbsPerWeek]
  );

  const recommendation = useMemo(
    () => getCalorieRecommendation(draftProfile),
    [draftProfile]
  );

  const handleSave = () => {
    onSave(draftProfile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="card p-6">
        <h2 className="page-title">Your Profile</h2>
        <p className="page-desc mt-1">
          Update your stats or weight loss goal. Targets recalculate
          automatically.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              min={15}
              max={100}
              className="input"
            />
          </div>

          <div>
            <label className="label">Height</label>
            <div className="flex gap-2">
              <div className="flex flex-1 items-center gap-1.5">
                <input
                  type="number"
                  value={feet}
                  onChange={(e) => setFeet(Number(e.target.value))}
                  min={4}
                  max={7}
                  className="input"
                />
                <span className="text-sm text-slate-400">ft</span>
              </div>
              <div className="flex flex-1 items-center gap-1.5">
                <input
                  type="number"
                  value={inches}
                  onChange={(e) => setInches(Number(e.target.value))}
                  min={0}
                  max={11}
                  className="input"
                />
                <span className="text-sm text-slate-400">in</span>
              </div>
            </div>
          </div>

          <div>
            <label className="label">Weight (lbs)</label>
            <input
              type="number"
              value={weightLbs}
              onChange={(e) => setWeightLbs(Number(e.target.value))}
              min={80}
              max={500}
              className="input"
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

          <div className="sm:col-span-2">
            <label className="label">Weight Loss Goal (lbs/week)</label>
            <div className="grid grid-cols-4 gap-2">
              {LBS_OPTIONS.map((lbs) => (
                <button
                  key={lbs}
                  type="button"
                  onClick={() => setLbsPerWeek(lbs)}
                  className={`chip py-2.5 text-sm ${lbsPerWeek === lbs ? "chip-active" : ""}`}
                >
                  {lbs} lb
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary mt-6 w-full">
          <Save className="h-4 w-4" />
          {saved ? "Saved!" : "Update Goals"}
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-brand-100 bg-brand-50/50 px-6 py-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-brand-600" />
            <h3 className="font-bold text-slate-800">Daily Targets</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3">
          {[
            {
              label: "Calories",
              value: recommendation.targetCalories,
              unit: "kcal",
              color: "text-accent-600",
            },
            {
              label: "Protein",
              value: recommendation.protein,
              unit: "g",
              color: "text-sky-600",
            },
            {
              label: "Carbs",
              value: recommendation.carbs,
              unit: "g",
              color: "text-violet-600",
            },
            {
              label: "Fat",
              value: recommendation.fat,
              unit: "g",
              color: "text-amber-600",
            },
            {
              label: "Fiber",
              value: recommendation.fiber,
              unit: "g",
              color: "text-emerald-600",
            },
            {
              label: "Deficit",
              value: recommendation.deficit,
              unit: "kcal",
              color: "text-brand-600",
            },
          ].map(({ label, value, unit, color }) => (
            <div key={label} className="card-muted p-3 text-center">
              <p className="text-xs font-semibold text-slate-400">{label}</p>
              <p className={`text-lg font-bold ${color}`}>
                {value}
                <span className="ml-0.5 text-xs font-medium text-slate-400">
                  {unit}
                </span>
              </p>
            </div>
          ))}
        </div>
        <p className="border-t border-slate-100 px-5 py-4 text-sm text-slate-500">
          Eating <strong className="text-brand-700">{recommendation.targetCalories} kcal/day</strong> supports
          losing <strong className="text-brand-700">{lbsPerWeek} lb/week</strong>.
        </p>
      </div>
    </div>
  );
}
