"use client";

import { useState } from "react";
import {
  Camera,
  LayoutDashboard,
  PenLine,
  User,
  Wheat,
} from "lucide-react";
import { useTracker } from "@/hooks/useTracker";
import { getGoalLabel } from "@/lib/nutrition";
import { Dashboard } from "@/components/Dashboard";
import { Onboarding } from "@/components/Onboarding";
import { ProfileSetup } from "@/components/ProfileSetup";
import { CameraScanner } from "@/components/CameraScanner";
import { IngredientTracker } from "@/components/IngredientTracker";
import { ManualEntry } from "@/components/ManualEntry";

type Tab = "dashboard" | "scan" | "ingredients" | "manual" | "profile";

const TABS: Array<{ id: Tab; label: string; icon: typeof LayoutDashboard }> = [
  { id: "dashboard", label: "Today", icon: LayoutDashboard },
  { id: "scan", label: "Scan", icon: Camera },
  { id: "ingredients", label: "Add", icon: Wheat },
  { id: "manual", label: "Manual", icon: PenLine },
  { id: "profile", label: "Profile", icon: User },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const {
    loaded,
    isOnboarded,
    todayTotals,
    todayEntries,
    profile,
    recommendation,
    addEntry,
    removeEntry,
    updateProfile,
    completeOnboarding,
    addMultipleEntries,
  } = useTracker();

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand-600" />
      </div>
    );
  }

  if (!isOnboarded) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  if (!profile || !recommendation) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg pb-28">
      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/70 px-5 py-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-hero-gradient text-sm font-bold text-white shadow-md">
              N
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                NutriAI
              </h1>
              <p className="text-xs text-slate-400">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-brand-50 px-3 py-2 text-right ring-1 ring-brand-100">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-600">
              {getGoalLabel(recommendation.goalMode)}
            </p>
            <p className="text-sm font-bold text-brand-800">
              {recommendation.targetCalories}{" "}
              <span className="text-xs font-medium text-brand-600">kcal</span>
            </p>
          </div>
        </div>
      </header>

      <main className="px-4 py-5">
        {activeTab === "dashboard" && (
          <Dashboard
            todayTotals={todayTotals}
            recommendation={recommendation}
            todayEntries={todayEntries}
            onRemoveEntry={removeEntry}
          />
        )}

        {activeTab === "scan" && (
          <div className="space-y-4">
            <div>
              <h2 className="page-title">Scan Your Food</h2>
              <p className="page-desc mt-1">
                Take a photo or upload an image. Claude or Gemini will identify
                foods and estimate all macros.
              </p>
            </div>
            <CameraScanner
              onAddFoods={(foods) =>
                addMultipleEntries(
                  foods.map((f) => ({
                    name: f.name,
                    grams: f.grams,
                    calories: f.calories,
                    protein: f.protein,
                    fiber: f.fiber,
                    fat: f.fat,
                    carbs: f.carbs,
                    source: "ai" as const,
                  }))
                )
              }
            />
          </div>
        )}

        {activeTab === "ingredients" && (
          <div className="space-y-4">
            <div>
              <h2 className="page-title">Track by Ingredient</h2>
              <p className="page-desc mt-1">
                Search foods, set grams for each ingredient, and log combined
                meals.
              </p>
            </div>
            <IngredientTracker
              onAddMeal={(name, ingredients) => {
                if (ingredients.length === 1) {
                  const ing = ingredients[0];
                  addEntry({
                    name: ing.name,
                    grams: ing.grams,
                    calories: ing.calories,
                    protein: ing.protein,
                    fiber: ing.fiber,
                    fat: ing.fat,
                    carbs: ing.carbs,
                    source: "ingredient",
                  });
                } else {
                  const totals = ingredients.reduce(
                    (acc, ing) => ({
                      calories: acc.calories + ing.calories,
                      protein: acc.protein + ing.protein,
                      fiber: acc.fiber + ing.fiber,
                      fat: acc.fat + ing.fat,
                      carbs: acc.carbs + ing.carbs,
                    }),
                    { calories: 0, protein: 0, fiber: 0, fat: 0, carbs: 0 }
                  );
                  addEntry({
                    name,
                    calories: totals.calories,
                    protein: Math.round(totals.protein * 10) / 10,
                    fiber: Math.round(totals.fiber * 10) / 10,
                    fat: Math.round(totals.fat * 10) / 10,
                    carbs: Math.round(totals.carbs * 10) / 10,
                    source: "ingredient",
                  });
                }
              }}
            />
          </div>
        )}

        {activeTab === "manual" && (
          <div className="space-y-4">
            <div>
              <h2 className="page-title">Manual Entry</h2>
              <p className="page-desc mt-1">
                Enter nutrition values from a label or your own calculations.
              </p>
            </div>
            <ManualEntry
              onAdd={(name, nutrition, grams) =>
                addEntry({ name, grams, ...nutrition, source: "manual" })
              }
            />
          </div>
        )}

        {activeTab === "profile" && (
          <ProfileSetup profile={profile} onSave={updateProfile} />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-4 pt-2">
        <div className="mx-auto max-w-lg rounded-2xl border border-white/80 bg-white/90 px-2 py-2 shadow-nav backdrop-blur-xl">
          <div className="flex justify-around">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-[10px] font-semibold transition-all ${
                    active
                      ? "text-brand-700"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-0 rounded-xl bg-brand-50 ring-1 ring-brand-100" />
                  )}
                  <Icon
                    className={`relative h-5 w-5 ${active ? "text-brand-600" : ""}`}
                  />
                  <span className="relative">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
