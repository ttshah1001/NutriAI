import type { FoodEntry, UserProfile } from "./types";

const ENTRIES_KEY = "calorie-tracker-entries";
const PROFILE_KEY = "calorie-tracker-profile";

export const EMPTY_PROFILE: UserProfile = {
  heightInches: 70,
  weightLbs: 180,
  age: 30,
  gender: "male",
  activityLevel: "moderate",
  lbsPerWeek: 1,
  onboardingComplete: false,
};

function migrateProfile(raw: Record<string, unknown>): UserProfile {
  if (raw.onboardingComplete !== undefined && raw.heightInches !== undefined) {
    return { ...EMPTY_PROFILE, ...raw } as UserProfile;
  }

  // Migrate old metric profile format
  const heightCm = Number(raw.heightCm ?? 170);
  const weightKg = Number(raw.weightKg ?? 70);
  const goal = raw.goal as string | undefined;

  return {
    heightInches: Math.round(heightCm / 2.54),
    weightLbs: Math.round(weightKg / 0.453592),
    age: Number(raw.age ?? 30),
    gender: (raw.gender as UserProfile["gender"]) ?? "male",
    activityLevel:
      (raw.activityLevel as UserProfile["activityLevel"]) ?? "moderate",
    lbsPerWeek: goal === "lose" ? 1 : 0,
    onboardingComplete: Boolean(raw.onboardingComplete),
  };
}

export function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

export function loadEntries(): FoodEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries: FoodEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return migrateProfile(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getTodayEntries(entries: FoodEntry[]): FoodEntry[] {
  const today = getTodayKey();
  return entries.filter((e) => {
    const entryDate = new Date(e.timestamp).toISOString().split("T")[0];
    return entryDate === today;
  });
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function completeProfile(
  profile: Omit<UserProfile, "onboardingComplete">
): UserProfile {
  return { ...profile, onboardingComplete: true };
}
