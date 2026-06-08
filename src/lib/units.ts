export function lbsToKg(lbs: number): number {
  return lbs * 0.453592;
}

export function inchesToCm(inches: number): number {
  return inches * 2.54;
}

export function inchesToFeetInches(totalInches: number): {
  feet: number;
  inches: number;
} {
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

export function feetInchesToInches(feet: number, inches: number): number {
  return feet * 12 + inches;
}
