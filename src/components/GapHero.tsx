"use client";

import { useState } from "react";
import { TarumiCharacter } from "@/components/TarumiCharacter";
import type { MascotMood } from "@/components/TarumiCharacter";
import { SITE_NAME } from "@/lib/site";

const yen = new Intl.NumberFormat("ja-JP");

type Props = {
  amountAtRetire: number;
  targetAmount: number;
  gapAmount: number;
  targetReached: boolean;
  progressPercent: number;
  yearsToTarget: number;
  momentumMessage: string;
  mood: MascotMood;
};

export function GapHero({
  amountAtRetire,
  targetAmount,
  gapAmount,
  targetReached,
  progressPercent,
  yearsToTarget,
  momentumMessage,
  mood,
}: Props) {
  const [petCount, setPetCount] = useState(0);
  const [wiggle, setWiggle] = useState(false);
  const ratio = Math.min(Math.max(progressPercent, 0), 100);

  const supportLine = targetReached
    ? "達成コース。このペース、いい感じ。"
    : "ギャップ、一緒に詰めよう。";

  function handlePet() {
    setPetCount((c) => c + 1);
    setWiggle(true);
    window.setTimeout(() => setWiggle(false), 500);
  }

  return (
    <section className="gap-hero" id="gap-hero" aria-labelledby="gap-hero-title">
      <div className="gap-hero-atmosphere" aria-hidden />

      <div className="gap-hero-brand">
        <h1 id="gap-hero-title" className="gap-hero-title">
          {SITE_NAME}
        </h1>
        <p className="gap-hero-promise">
          引退時の想定と目標のギャップを、一目で。
        </p>
      </div>

      <div className="gap-hero-focus">
        <p className="gap-hero-gap-label">
          {targetReached ? "目標達成コース" : "目標まであと"}
        </p>
        <p
          className={`gap-hero-gap-amount ${targetReached ? "is-reached" : ""}`}
          aria-live="polite"
        >
          {targetReached ? "達成！" : `¥${yen.format(gapAmount)}`}
        </p>
        <p className="gap-hero-momentum">{momentumMessage}</p>

        <div className="gap-hero-meaning" aria-label="引退時想定と目標の比較">
          <div className="gap-hero-meaning-row">
            <span className="gap-hero-meaning-label">引退時の想定</span>
            <span className="gap-hero-meaning-value">
              ¥{yen.format(amountAtRetire)}
            </span>
          </div>
          <div className="gap-hero-meaning-row gap-hero-meaning-row-target">
            <span className="gap-hero-meaning-label">目標資産</span>
            <span className="gap-hero-meaning-value">
              ¥{yen.format(targetAmount)}
            </span>
          </div>
          <div className="gap-hero-meaning-row">
            <span className="gap-hero-meaning-label">引退まで</span>
            <span className="gap-hero-meaning-value gap-hero-meaning-years">
              {yearsToTarget > 0 ? `あと ${yearsToTarget} 年` : "いま"}
            </span>
          </div>
        </div>

        <div className="gap-hero-meter-block">
          <div
            className="gap-hero-meter"
            role="progressbar"
            aria-valuenow={ratio}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`引退時想定の目標達成度 ${ratio}%`}
          >
            <div
              className="gap-hero-meter-fill"
              style={{ width: `${ratio}%` }}
            />
          </div>
          <p className="gap-hero-meter-caption">
            引退時想定で目標の <strong>{ratio}%</strong>
          </p>
        </div>

        {!targetReached && (
          <a href="#act" className="gap-hero-act-link">
            ギャップを縮める →
          </a>
        )}
      </div>

      <div className="gap-hero-companion">
        <button
          type="button"
          className={`gap-hero-mascot ${wiggle ? "wiggle" : ""} ${mood === "celebrate" ? "celebrate" : ""}`}
          onClick={handlePet}
          aria-label="みつきをなでる"
        >
          {petCount > 0 && (
            <div className="heart-pop" key={petCount}>
              ♡
            </div>
          )}
          <TarumiCharacter
            mood={mood}
            size={48}
            fill
            alluring={wiggle}
            className={wiggle ? "tarumi-petting" : ""}
          />
        </button>
        <p className="gap-hero-companion-line">
          <span className="gap-hero-companion-name">みつき</span>
          {supportLine}
        </p>
      </div>

      <div className="flow-bridge" aria-hidden>
        <span className="flow-bridge-line" />
        <span className="flow-bridge-label">道のりへ</span>
      </div>
    </section>
  );
}
