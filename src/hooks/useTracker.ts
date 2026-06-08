"use client";

import { useCallback, useEffect, useState } from "react";
import { getCalorieRecommendation, sumNutrition } from "@/lib/nutrition";
import {
  generateId,
  getTodayEntries,
  loadEntries,
  loadProfile,
  saveEntries,
  saveProfile,
} from "@/lib/storage";
import type {
  CalorieRecommendation,
  FoodEntry,
  NutritionValues,
  UserProfile,
} from "@/lib/types";

export function useTracker() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recommendation, setRecommendation] =
    useState<CalorieRecommendation | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedEntries = loadEntries();
    const savedProfile = loadProfile();
    setEntries(savedEntries);
    setProfile(savedProfile);
    if (savedProfile?.onboardingComplete) {
      setRecommendation(getCalorieRecommendation(savedProfile));
    }
    setLoaded(true);
  }, []);

  const todayEntries = getTodayEntries(entries);
  const todayTotals = sumNutrition(todayEntries);

  const addEntry = useCallback(
    (
      entry: Omit<FoodEntry, "id" | "timestamp"> & { timestamp?: number }
    ) => {
      const newEntry: FoodEntry = {
        ...entry,
        id: generateId(),
        timestamp: entry.timestamp ?? Date.now(),
      };
      setEntries((prev) => {
        const updated = [...prev, newEntry];
        saveEntries(updated);
        return updated;
      });
    },
    []
  );

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      saveEntries(updated);
      return updated;
    });
  }, []);

  const updateProfile = useCallback((newProfile: UserProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
    if (newProfile.onboardingComplete) {
      setRecommendation(getCalorieRecommendation(newProfile));
    }
  }, []);

  const completeOnboarding = useCallback((newProfile: UserProfile) => {
    const complete = { ...newProfile, onboardingComplete: true };
    setProfile(complete);
    saveProfile(complete);
    setRecommendation(getCalorieRecommendation(complete));
  }, []);

  const addMultipleEntries = useCallback(
    (newEntries: Omit<FoodEntry, "id" | "timestamp">[]) => {
      const withIds = newEntries.map((e) => ({
        ...e,
        id: generateId(),
        timestamp: Date.now(),
      }));
      setEntries((prev) => {
        const updated = [...prev, ...withIds];
        saveEntries(updated);
        return updated;
      });
    },
    []
  );

  const isOnboarded = profile?.onboardingComplete ?? false;

  return {
    loaded,
    isOnboarded,
    entries,
    todayEntries,
    todayTotals,
    profile,
    recommendation,
    addEntry,
    removeEntry,
    updateProfile,
    completeOnboarding,
    addMultipleEntries,
  };
}

export function getProgressPercent(
  current: number,
  target: number
): number {
  if (target <= 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
}

export function getRemaining(
  current: number,
  target: number
): number {
  return Math.max(target - current, 0);
}

export type MacroKey = keyof NutritionValues;

export const MACRO_CONFIG: Record<
  MacroKey,
  { label: string; unit: string; color: string; ring: string }
> = {
  calories: {
    label: "Calories",
    unit: "kcal",
    color: "bg-accent-500",
    ring: "text-accent-500",
  },
  protein: {
    label: "Protein",
    unit: "g",
    color: "bg-sky-500",
    ring: "text-sky-500",
  },
  fiber: {
    label: "Fiber",
    unit: "g",
    color: "bg-emerald-500",
    ring: "text-emerald-500",
  },
  fat: {
    label: "Fat",
    unit: "g",
    color: "bg-amber-500",
    ring: "text-amber-500",
  },
  carbs: {
    label: "Carbs",
    unit: "g",
    color: "bg-violet-500",
    ring: "text-violet-500",
  },
};
