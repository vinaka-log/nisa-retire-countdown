"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { TarumiCharacter } from "./TarumiCharacter";
import { moodFromProgress } from "./NisaruMascot";

type Props = {
  progressPercent: number;
  currentAmount: number;
  targetAmount: number;
  targetReached: boolean;
};

/** 1km = 100万円 のメタファーで距離を表示 */
function journeyDistances(currentAmount: number, targetAmount: number) {
  const safeTarget = Math.max(targetAmount, 1);
  const ratio = Math.min(currentAmount / safeTarget, 1);
  const totalKm = Math.round((safeTarget / 1_000_000) * 10) / 10;
  const traveledKm = Math.round(totalKm * ratio * 10) / 10;
  const remainingKm = Math.round((totalKm - traveledKm) * 10) / 10;
  return { totalKm, traveledKm, remainingKm, ratio };
}

export function ProgressJourney({
  progressPercent,
  currentAmount,
  targetAmount,
  targetReached,
}: Props) {
  const { totalKm, traveledKm, remainingKm } = journeyDistances(
    currentAmount,
    targetAmount,
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
      const next = Math.round(start + (end - start) * eased);
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

  return (
    <article className="progress-journey">
      <div className="progress-journey-header">
        <p className="progress-journey-label">引退時想定 → 目標</p>
        <div className="progress-journey-metrics">
          <p className="progress-journey-percent">
            <span className="progress-journey-percent-num">{displayPercent}</span>
            <span className="progress-journey-percent-unit">%</span>
          </p>
          <p className="progress-journey-km">
            {targetReached ? "ゴール到達" : `あと ${remainingKm} km`}
          </p>
        </div>
        <p className="progress-journey-sub">
          {traveledKm} / {totalKm} km（1km ≒ 100万円）
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
