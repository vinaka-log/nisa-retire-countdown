"use client";

import { useEffect, useState, type CSSProperties } from "react";

type Props = {
  label: string;
  value: number;
  raw: string;
  onRawChange: (raw: string) => void;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  /** Format number for the text field (e.g. with commas). */
  formatDisplay?: (value: number) => string;
  /** Parse display text back to a number. */
  parseDisplay?: (raw: string) => number | null;
  hint?: string;
};

const defaultFormat = (n: number) => String(n);
const defaultParse = (raw: string) => {
  const trimmed = raw.trim().replace(/,/g, "");
  if (trimmed === "") return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function snap(n: number, step: number) {
  if (step <= 0) return n;
  const precision = step < 1 ? Math.round(-Math.log10(step)) : 0;
  const snapped = Math.round(n / step) * step;
  return precision > 0 ? Number(snapped.toFixed(precision)) : snapped;
}

export function StepperInput({
  label,
  value,
  raw,
  onRawChange,
  onValueChange,
  min,
  max,
  step,
  unit,
  formatDisplay = defaultFormat,
  parseDisplay = defaultParse,
  hint,
}: Props) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState(raw);

  // Keep draft in sync with parent when not editing (slider / +/- / external).
  useEffect(() => {
    if (!focused) setDraft(raw);
  }, [raw, focused]);

  function commit(next: number) {
    const clamped = clamp(snap(next, step), min, max);
    const display = formatDisplay(clamped);
    // Keep text + slider + parent state on the same committed value.
    onValueChange(clamped);
    onRawChange(display);
    setDraft(display);
  }

  /** Prefer the in-progress draft when +/- is pressed before blur. */
  function baseForStep(): number {
    const parsed = parseDisplay(focused ? draft : raw);
    return parsed === null ? value : parsed;
  }

  function handleBlur() {
    setFocused(false);
    const parsed = parseDisplay(draft);
    if (parsed === null) {
      const fallback = formatDisplay(value);
      setDraft(fallback);
      onRawChange(fallback);
      return;
    }
    commit(parsed);
  }

  function handleSlider(rawValue: string) {
    commit(Number(rawValue));
  }

  const sliderMax = Math.max(max, min);
  // Slider thumb must reflect the same number used in calculation when
  // parent passes an in-range value; never show a different clamped phantom.
  const sliderValue = clamp(value, min, sliderMax);
  const percent =
    sliderMax === min ? 0 : ((sliderValue - min) / (sliderMax - min)) * 100;

  return (
    <div className="stepper-field">
      <div className="stepper-field-top">
        <label className="stepper-field-label">
          {label}
          {hint ? (
            <span className="stepper-field-hint" title={hint}>
              i
            </span>
          ) : null}
        </label>
        <div className="stepper-controls">
          <button
            type="button"
            className="stepper-btn"
            aria-label={`${label}を${step}${unit}減らす`}
            onClick={() => commit(baseForStep() - step)}
            disabled={value <= min}
          >
            −
          </button>
          <div className="stepper-value">
            <input
              type="text"
              inputMode="decimal"
              className={`stepper-input${unit === "円" ? " stepper-input-yen" : ""}`}
              value={focused ? draft : raw}
              onChange={(e) => setDraft(e.target.value)}
              onFocus={() => {
                setFocused(true);
                setDraft(raw);
              }}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  (e.target as HTMLInputElement).blur();
                }
              }}
              aria-label={`${label}（直接入力可）`}
              size={unit === "円" ? 12 : 6}
            />
            <span className="stepper-unit">{unit}</span>
          </div>
          <button
            type="button"
            className="stepper-btn"
            aria-label={`${label}を${step}${unit}増やす`}
            onClick={() => commit(baseForStep() + step)}
            disabled={value >= max}
          >
            ＋
          </button>
        </div>
      </div>
      <input
        type="range"
        className="stepper-slider"
        min={min}
        max={sliderMax}
        step={step}
        value={sliderValue}
        onChange={(e) => handleSlider(e.target.value)}
        aria-label={`${label}のスライダー`}
        style={{ "--slider-pct": `${percent}%` } as CSSProperties}
      />
    </div>
  );
}
