"use client";

import { useEffect, useState } from "react";

const yen = new Intl.NumberFormat("ja-JP");

type Props = {
  gapAmount: number;
  targetReached: boolean;
  progressPercent: number;
  yearsToTarget?: number;
  onBoost?: (step: number) => void;
};

/**
 * Sticky mini gap — keeps 1st fixation available while scrolling to
 * boosts / inputs. Hidden in first viewport so it never competes with hero.
 * Renders a spacer so fixed bar does not cover content underneath.
 */
export function StickyGapBar({
  gapAmount,
  targetReached,
  progressPercent,
  yearsToTarget,
  onBoost,
}: Props) {
  const [visible, setVisible] = useState(false);
  const ratio = Math.min(Math.max(progressPercent, 0), 100);

  useEffect(() => {
    const target =
      document.querySelector(".gap-hero-focus") ??
      document.getElementById("gap-hero") ??
      document.getElementById("gap");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      // Trigger once the gap number clears the sticky header
      { threshold: 0, rootMargin: "-64px 0px 0px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <>
      <div className="sticky-gap-bar" role="status" aria-live="polite">
        <div className="sticky-gap-bar-inner">
          <div className="sticky-gap-bar-text">
            <span className="sticky-gap-bar-label">
              {targetReached ? "達成コース" : "あと"}
            </span>
            <span
              className={`sticky-gap-bar-amount ${targetReached ? "is-reached" : ""}`}
            >
              {targetReached ? "達成！" : `¥${yen.format(gapAmount)}`}
            </span>
            <span className="sticky-gap-bar-meta">
              {progressPercent}%
              {typeof yearsToTarget === "number" && yearsToTarget > 0
                ? ` · ${yearsToTarget}年`
                : ""}
            </span>
          </div>

          <div className="sticky-gap-bar-meter" aria-hidden>
            <div
              className="sticky-gap-bar-meter-fill"
              style={{ width: `${ratio}%` }}
            />
          </div>

          {!targetReached && onBoost ? (
            <div className="sticky-gap-bar-actions">
              <button
                type="button"
                className="sticky-boost-btn sticky-boost-btn-primary"
                onClick={() => onBoost(5000)}
              >
                +5千
              </button>
              <button
                type="button"
                className="sticky-boost-btn sticky-boost-btn-strong"
                onClick={() => onBoost(10000)}
              >
                +1万
              </button>
            </div>
          ) : !targetReached ? (
            <a href="#act" className="sticky-gap-bar-cta">
              縮める
            </a>
          ) : null}
        </div>
      </div>
      {/* Reserve space so fixed bar never covers section headings */}
      <div className="sticky-gap-bar-spacer" aria-hidden />
    </>
  );
}
