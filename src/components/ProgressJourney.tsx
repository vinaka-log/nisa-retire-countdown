"use client";

import { useEffect, useRef, useState } from "react";
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
  const { totalKm, traveledKm, remainingKm } = journeyDistances(currentAmount, targetAmount);
  const clampedPercent = Math.min(Math.max(progressPercent, 0), 100);
  const [runFrame, setRunFrame] = useState<0 | 1>(0);
  const [displayPercent, setDisplayPercent] = useState(clampedPercent);
  const prevPercent = useRef(clampedPercent);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRunFrame((f) => (f === 0 ? 1 : 0));
    }, 180);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (prevPercent.current === clampedPercent) return;
    const start = prevPercent.current;
    const end = clampedPercent;
    const duration = 900;
    const startTime = performance.now();

    function tick(now: number) {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      setDisplayPercent(Math.round(start + (end - start) * eased));
      if (t < 1) requestAnimationFrame(tick);
      else prevPercent.current = end;
    }

    requestAnimationFrame(tick);
  }, [clampedPercent]);

  const milestones = [25, 50, 75];
  const runMood = moodFromProgress(clampedPercent, targetReached);

  return (
    <article className="progress-journey">
      <div className="progress-journey-header">
        <div>
          <p className="progress-journey-label">目標進捗</p>
          <p className="progress-journey-percent">{clampedPercent}%</p>
        </div>
        <div className="progress-journey-distance">
          <p className="progress-journey-label">ゴールまで</p>
          <p className="progress-journey-km">
            {targetReached ? "到達！" : `あと ${remainingKm} km`}
          </p>
          <p className="progress-journey-sub">
            {traveledKm} / {totalKm} km 走破
          </p>
        </div>
      </div>

      <div className="progress-scene" aria-hidden>
        <div className="progress-sky">
          <span className="cloud cloud-a" />
          <span className="cloud cloud-b" />
        </div>

        <div className="progress-track-wrap">
          <div className="progress-track-labels">
            <span>スタート</span>
            <span>ゴール 🏁</span>
          </div>

          <div className="progress-track">
            <div className="progress-track-done" style={{ width: `${displayPercent}%` }} />
            <div
              className="progress-track-remaining"
              style={{ left: `${displayPercent}%`, width: `${100 - displayPercent}%` }}
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
              style={{ left: `calc(${displayPercent}% - 34px)` }}
            >
              <div className="runner-dust" />
              <TarumiCharacter
                mood={runMood}
                pose={targetReached ? "idle" : "run"}
                runFrame={runFrame}
                size={68}
              />
              <div className="runner-shadow" />
            </div>

            <div className="progress-goal-flag">🏁</div>
          </div>
        </div>
      </div>

      <p className="progress-journey-caption">
        {targetReached
          ? "たるみちゃん、ゴール到着！マジ神。"
          : "たるみちゃんが資産ロード走ってる〜。積立続けると近づくよ。"}
      </p>
    </article>
  );
}
