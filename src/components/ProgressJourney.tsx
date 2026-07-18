"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { TarumiCharacter } from "./TarumiCharacter";
import { moodFromProgress } from "./NisaruMascot";
import {
  formatKm,
  formatProgressPercentLabel,
  journeyDistancesFromYen,
} from "@/lib/format";

type Props = {
  progressPercent: number;
  amountAtRetire: number;
  targetAmount: number;
  gapAmount: number;
  targetReached: boolean;
};

export function ProgressJourney({
  progressPercent,
  amountAtRetire,
  targetAmount,
  gapAmount,
  targetReached,
}: Props) {
  const { totalKm, traveledKm, remainingKm } = journeyDistancesFromYen(
    amountAtRetire,
    targetAmount,
    gapAmount,
  );
  const clampedPercent = Math.min(Math.max(progressPercent, 0), 100);
  const [runFrame, setRunFrame] = useState<0 | 1>(0);
  const [displayPercent, setDisplayPercent] = useState(clampedPercent);
  const displayPercentRef = useRef(clampedPercent);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRunFrame((f) => (f === 0 ? 1 : 0));
    }, 180);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const start = displayPercentRef.current;
    const end = clampedPercent;
    if (start === end) return;

    const duration = 900;
    const startTime = performance.now();
    let raf = 0;

    function tick(now: number) {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      const next =
        Math.round((start + (end - start) * eased) * 10) / 10;
      displayPercentRef.current = next;
      setDisplayPercent(next);
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        displayPercentRef.current = end;
        setDisplayPercent(end);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [clampedPercent]);

  const milestones = [25, 50, 75];
  const runMood = moodFromProgress(clampedPercent, targetReached);
  const percentLabel = formatProgressPercentLabel(
    displayPercent,
    targetReached || displayPercent >= 100,
  );

  return (
    <article className="progress-journey">
      <div className="progress-journey-header">
        <p className="progress-journey-label">引退時想定 → 目標</p>
        <div className="progress-journey-metrics">
          <p className="progress-journey-percent">
            <span className="progress-journey-percent-num">{percentLabel}</span>
            <span className="progress-journey-percent-unit">%</span>
          </p>
          <p className="progress-journey-km">
            {targetReached
              ? "ゴール到達"
              : `あと ${formatKm(remainingKm)} km`}
          </p>
        </div>
        <p className="progress-journey-sub">
          {formatKm(traveledKm)} / {formatKm(totalKm)} km（1km ≒ 100万円）
        </p>
      </div>

      <div className="progress-scene" aria-hidden>
        <div className="progress-sky">
          <span className="cloud cloud-a" />
          <span className="cloud cloud-b" />
        </div>

        <div className="progress-track-wrap">
          <div className="progress-track-labels">
            <span>スタート</span>
            <span>ゴール</span>
          </div>

          <div className="progress-track">
            <div
              className="progress-track-done"
              style={{ width: `${displayPercent}%` }}
            />
            <div
              className="progress-track-remaining"
              style={{
                left: `${displayPercent}%`,
                width: `${100 - displayPercent}%`,
              }}
            />

            {milestones.map((m) => (
              <div
                key={m}
                data-milestone={m}
                className={`progress-milestone ${displayPercent >= m ? "passed" : ""}`}
                style={{ left: `${m}%` }}
              >
                <span className="progress-milestone-pole" />
                <span className="progress-milestone-flag">{m}%</span>
              </div>
            ))}

            <div
              className={`progress-runner ${targetReached ? "arrived" : "running"}`}
              style={
                {
                  ["--runner-left"]: `${displayPercent}%`,
                } as CSSProperties
              }
            >
              <div className="runner-dust" />
              <TarumiCharacter
                mood={runMood}
                pose={targetReached ? "idle" : "run"}
                runFrame={runFrame}
                size={44}
                fill
                className="tarumi-runner-face"
              />
              <div className="runner-shadow" />
            </div>

            <div className="progress-goal-flag" aria-hidden>
              🏁
            </div>
          </div>
        </div>
      </div>

      <p className="progress-journey-caption">
        {targetReached
          ? "みつき、ゴール到着。引退時想定で目標達成コース。"
          : "進捗は「引退時の想定資産 ÷ 目標」。積立を増やすと、みつきが近づく。"}
      </p>
    </article>
  );
}
