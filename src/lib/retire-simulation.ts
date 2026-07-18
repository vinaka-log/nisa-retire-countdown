import { progressPercentFromYen } from "@/lib/format";

export type RetirePlanInput = {
  currentAge: number;
  retireAge: number;
  currentAmount: number;
  monthlyContribution: number;
  annualReturnPercent: number;
  targetAmount: number;
};

export type RetirePlanResult = {
  /** Inputs actually used after clamp (matches slider min/max). */
  input: RetirePlanInput;
  yearsToTarget: number;
  ageAtTarget: number;
  monthsToTarget: number;
  amountAtRetire: number;
  targetReached: boolean;
  gapAmount: number;
  requiredMonthlyContribution: number;
  /** 0–1, based on amountAtRetire / targetAmount */
  progressRatio: number;
  /**
   * 0–100 with 1 decimal place (e.g. 72.5).
   * Aligned with 0.1km display; 100 only when targetReached.
   */
  progressPercent: number;
  monthlyPassiveIncome: number;
  annualPassiveIncome: number;
};

export const INPUT_LIMITS = {
  currentAge: { min: 18, max: 80, step: 1 },
  retireAge: { min: 30, max: 90, step: 1 },
  currentAmount: { min: 0, max: 100_000_000, step: 100_000 },
  monthlyContribution: { min: 0, max: 300_000, step: 1_000 },
  annualReturnPercent: { min: 0, max: 15, step: 0.1 },
  targetAmount: { min: 1_000_000, max: 200_000_000, step: 1_000_000 },
} as const;

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function snap(n: number, step: number) {
  if (step <= 0) return n;
  const precision = step < 1 ? Math.round(-Math.log10(step)) : 0;
  const snapped = Math.round(n / step) * step;
  return precision > 0 ? Number(snapped.toFixed(precision)) : snapped;
}

/** Snap + clamp a single field to its slider limits (for commits / boosts). */
export function constrainInput(
  key: keyof typeof INPUT_LIMITS,
  value: number,
): number {
  const { min, max, step } = INPUT_LIMITS[key];
  return clamp(snap(value, step), min, max);
}

/** Clamp only — used so live typing is not silently re-rounded mid-edit. */
function clampInput(key: keyof typeof INPUT_LIMITS, value: number): number {
  const { min, max } = INPUT_LIMITS[key];
  return clamp(value, min, max);
}

/**
 * Normalize inputs so calculation uses the same bounds as the sliders.
 * Also enforces retireAge >= currentAge.
 * Does not snap to step (that happens on slider/blur commit) so callers
 * can pass live values without silent re-rounding mid-edit.
 */
export function normalizeRetirePlanInput(
  input: RetirePlanInput,
): RetirePlanInput {
  const currentAge = clampInput("currentAge", input.currentAge);
  const retireAge = Math.max(
    clampInput("retireAge", input.retireAge),
    currentAge,
  );
  return {
    currentAge,
    retireAge: clamp(
      retireAge,
      INPUT_LIMITS.retireAge.min,
      INPUT_LIMITS.retireAge.max,
    ),
    currentAmount: clampInput("currentAmount", input.currentAmount),
    monthlyContribution: clampInput(
      "monthlyContribution",
      input.monthlyContribution,
    ),
    annualReturnPercent: clampInput(
      "annualReturnPercent",
      input.annualReturnPercent,
    ),
    targetAmount: clampInput("targetAmount", input.targetAmount),
  };
}

/**
 * Project retirement balance with end-of-month contributions and
 * nominal monthly rate (annual% / 100 / 12).
 */
export function simulateRetirePlan(rawInput: RetirePlanInput): RetirePlanResult {
  const input = normalizeRetirePlanInput(rawInput);
  const {
    currentAge,
    retireAge,
    currentAmount,
    monthlyContribution,
    annualReturnPercent,
    targetAmount,
  } = input;

  const years = Math.max(retireAge - currentAge, 0);
  const months = years * 12;
  const monthlyRate = annualReturnPercent / 100 / 12;

  let amount = currentAmount;
  for (let i = 0; i < months; i += 1) {
    amount = amount * (1 + monthlyRate) + monthlyContribution;
  }

  const amountAtRetire = Math.round(amount);
  const safeTarget = Math.max(targetAmount, 1);
  const targetReached = amountAtRetire >= targetAmount;
  const gapAmount = Math.max(targetAmount - amountAtRetire, 0);
  const progressRatio = Math.min(amountAtRetire / safeTarget, 1);
  const progressPercent = progressPercentFromYen(
    amountAtRetire,
    targetAmount,
    targetReached,
  );

  const annualPassiveIncome = Math.round(amountAtRetire * 0.04);
  const monthlyPassiveIncome = Math.round(annualPassiveIncome / 12);

  let requiredExact = 0;
  if (months > 0) {
    if (monthlyRate === 0) {
      requiredExact = Math.max((targetAmount - currentAmount) / months, 0);
    } else {
      const growth = (1 + monthlyRate) ** months;
      const numerator = targetAmount - currentAmount * growth;
      const denominator = (growth - 1) / monthlyRate;
      requiredExact = Math.max(numerator / denominator, 0);
    }
  }

  // Round up to the monthly slider step so the shown amount is settable
  // and actually reaches the target when applied in the same loop model.
  // Not clamped to the slider max — users may need more than the UI allows.
  const contribStep = INPUT_LIMITS.monthlyContribution.step;
  const requiredMonthlyContribution =
    requiredExact > 0
      ? Math.ceil(requiredExact / contribStep) * contribStep
      : 0;

  return {
    input,
    yearsToTarget: years,
    ageAtTarget: retireAge,
    monthsToTarget: months,
    amountAtRetire,
    targetReached,
    gapAmount,
    requiredMonthlyContribution,
    progressRatio,
    progressPercent,
    monthlyPassiveIncome,
    annualPassiveIncome,
  };
}
