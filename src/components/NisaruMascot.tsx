"use client";

import { useMemo, useState } from "react";
import { TarumiCharacter } from "./TarumiCharacter";
import type { MascotMood } from "./TarumiCharacter";

export type { MascotMood } from "./TarumiCharacter";

type Props = {
  mood: MascotMood;
  progressPercent: number;
  yearsLeft: number;
};

const DIALOGUE: Record<MascotMood, string[]> = {
  start: [
    "はじめまして♡ みつきよ。資産もスタイルも、一緒に磨いていこ？",
    "積立スタート？その決断、お姉さん好みかも…♡",
  ],
  focus: [
    "今は種まき期間よ。毎月コツコツが、未来のあなたをエロかわにするの。",
    "見ててあげるから。積立サボったら…ちょっと寂しいかも？",
  ],
  cheer: [
    "いい感じじゃん♡ その積立、お姉さんハートに直撃なんだけど。",
    "進捗伸びてきたわね。もっと見せて？…って、数字の話よ？",
  ],
  happy: [
    "やばっ、ゴール見えてきた。お姉さん、ドキドキ止まんないわ。",
    "神ペースすぎ。自由な生活、もうすぐキスできる距離じゃん。",
  ],
  celebrate: [
    "きたぁ！目標達成コース♡ ご褒美に、もっと応援しちゃう？",
    "最高すぎ。あとは一緒に、最高の引退ライフいこ？",
  ],
};

const PET_LINES = [
  "ちょ、タッチ攻撃…照れるじゃん♡ もう一回はアリよ？",
  "なでなでされたら、応援パワー上がるのよ〜",
  "え、お姉さんのこと好き？…積立も続けてね？",
  "ドキッ…♡ その調子で、資産もお姉さんも育てて？",
];

function pickLine(mood: MascotMood, progressPercent: number): string {
  const lines = DIALOGUE[mood];
  const idx = Math.floor(progressPercent / 25) % lines.length;
  return lines[idx] ?? lines[0];
}

export function NisaruMascot({ mood, progressPercent, yearsLeft }: Props) {
  const [petCount, setPetCount] = useState(0);
  const [wiggle, setWiggle] = useState(false);
  const [petLine, setPetLine] = useState<string | null>(null);

  const line = useMemo(
    () => petLine ?? pickLine(mood, progressPercent),
    [mood, progressPercent, petLine],
  );
  const level = Math.min(99, Math.max(1, Math.floor(progressPercent / 5) + 1));

  function handlePet() {
    setPetCount((c) => c + 1);
    setWiggle(true);
    setPetLine(PET_LINES[petCount % PET_LINES.length]);
    window.setTimeout(() => setWiggle(false), 500);
    window.setTimeout(() => setPetLine(null), 2800);
  }

  return (
    <div className="companion-panel gyaru-panel">
      <div className="companion-stage gyaru-stage">
        {petCount > 0 && (
          <div className="heart-pop" key={petCount}>
            ♡
          </div>
        )}
        <span className="gyaru-sparkle gyaru-sparkle-a">✦</span>
        <span className="gyaru-sparkle gyaru-sparkle-b">♡</span>
        <button
          type="button"
          className={`companion-tap gyaru-tap ${wiggle ? "wiggle" : ""} ${mood === "celebrate" ? "celebrate" : ""}`}
          onClick={handlePet}
          aria-label="みつきをなでる"
        >
          <TarumiCharacter
            mood={mood}
            size={132}
            fill
            alluring={wiggle}
            className={wiggle ? "tarumi-petting" : ""}
          />
        </button>
        <div className="companion-shadow" />
      </div>

      <div className="companion-info">
        <div className="companion-name-row">
          <span className="companion-badge gyaru-badge">お姉さんギャル</span>
          <p className="companion-name gyaru-name">みつき</p>
          <span className="companion-level gyaru-level">Lv.{level}</span>
        </div>
        <p className="companion-dialogue gyaru-dialogue">{line}</p>
        <p className="companion-hint">
          {yearsLeft > 0
            ? `あと ${yearsLeft} 年。タップして、お姉さんと距離縮めよ♡`
            : "ゴール目前！タップして、ご褒美の祝福ちょうだい？"}
        </p>
      </div>
    </div>
  );
}

export function moodFromProgress(
  progressPercent: number,
  targetReached: boolean,
): MascotMood {
  if (targetReached) return "celebrate";
  if (progressPercent >= 70) return "happy";
  if (progressPercent >= 40) return "cheer";
  if (progressPercent >= 15) return "focus";
  return "start";
}
