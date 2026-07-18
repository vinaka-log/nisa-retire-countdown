/** Shared display formatters so slider inputs and results use the same digits. */

const yen = new Intl.NumberFormat("ja-JP", {
  maximumFractionDigits: 0,
});

/** Whole yen with thousands separators (e.g. 28956010 → "28,956,010"). */
export function formatYen(n: number): string {
  return yen.format(Math.round(n));
}

export function parseYen(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, "");
  if (trimmed === "") return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

/** Annual return: always 1 decimal to match slider step 0.1 (e.g. "5.0"). */
export function formatReturnPercent(n: number): string {
  return (Math.round(n * 10) / 10).toFixed(1);
}

export function parseReturnPercent(raw: string): number | null {
  const trimmed = raw.trim().replace(/%/g, "");
  if (trimmed === "") return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

/** Display label for a progressPercent value (always one decimal, except 100). */
export function formatProgressPercentLabel(
  progressPercent: number,
  targetReached: boolean,
): string {
  if (targetReached || progressPercent >= 100) return "100";
  return (Math.round(progressPercent * 10) / 10).toFixed(1);
}

/** 1km ≒ 100万円 — always one decimal so 40.0 / 28.9 stay aligned. */
export function formatKm(n: number): string {
  return (Math.round(n * 10) / 10).toFixed(1);
}

/**
 * Journey distances from yen amounts so km digits match 引退時想定 / ギャップ / 目標.
 * remaining is adjusted so traveled + remaining === total after 0.1km rounding.
 */
export function journeyDistancesFromYen(
  amountAtRetire: number,
  targetAmount: number,
  gapAmount: number,
): { totalKm: number; traveledKm: number; remainingKm: number } {
  const safeTarget = Math.max(targetAmount, 1);
  const totalKm = Math.round((safeTarget / 1_000_000) * 10) / 10;
  const traveledKm =
    Math.round((Math.min(amountAtRetire, safeTarget) / 1_000_000) * 10) / 10;
  let remainingKm = Math.round((gapAmount / 1_000_000) * 10) / 10;
  const drift = Math.round((totalKm - traveledKm - remainingKm) * 10) / 10;
  if (drift !== 0) {
    remainingKm = Math.round((totalKm - traveledKm) * 10) / 10;
  }
  return { totalKm, traveledKm, remainingKm };
}

/**
 * Progress % aligned with the 0.1km display (1km ≒ 100万円),
 * so "72.5%" and "29.0 / 40.0 km" never disagree.
 */
export function progressPercentFromYen(
  amountAtRetire: number,
  targetAmount: number,
  targetReached: boolean,
): number {
  if (targetReached) return 100;
  const safeTarget = Math.max(targetAmount, 1);
  const totalKm = Math.round((safeTarget / 1_000_000) * 10) / 10;
  const traveledKm =
    Math.round((Math.min(amountAtRetire, safeTarget) / 1_000_000) * 10) / 10;
  if (totalKm <= 0) return 0;
  return Math.min(99.9, Math.floor((traveledKm / totalKm) * 1000) / 10);
}
