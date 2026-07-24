"use client";

import { useEffect, useState } from "react";
import { trackShare } from "@/lib/analytics";
import { formatYen } from "@/lib/format";

type ResultShareProps = {
  gapAmount: number;
  targetReached: boolean;
  yearsToTarget: number;
};

function shareOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    const withProtocol = /^https?:\/\//i.test(fromEnv)
      ? fromEnv
      : `https://${fromEnv}`;
    return withProtocol.replace(/\/$/, "");
  }
  // Static fallback — avoid window during render (hydration mismatch).
  return "https://www.nisa-simulation.com";
}

function buildShareText(
  gapAmount: number,
  targetReached: boolean,
  yearsToTarget: number,
): string {
  if (targetReached) {
    return `つみたてNISAの引退ギャップ、いまの条件だと達成見込み。無料シミュで試してみた →`;
  }
  return `つみたてNISA、引退まであと約¥${formatYen(gapAmount)}のギャップ（目安${yearsToTarget}年）。無料シミュで試してみた →`;
}

export function ResultShare({
  gapAmount,
  targetReached,
  yearsToTarget,
}: ResultShareProps) {
  const [canNativeShare, setCanNativeShare] = useState(false);
  const origin = shareOrigin();
  const text = buildShareText(gapAmount, targetReached, yearsToTarget);
  const fullText = `${text} ${origin}`;

  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== "undefined" && typeof navigator.share === "function",
    );
  }, []);

  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}`;
  const lineHref = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(origin)}&text=${encodeURIComponent(text)}`;

  async function onNativeShare() {
    trackShare("native");
    try {
      await navigator.share({
        title: "みつきリタイア",
        text,
        url: origin,
      });
    } catch {
      // user cancelled — ignore
    }
  }

  return (
    <div className="result-share" aria-label="結果をシェア">
      <p className="result-share-label">結果をシェア</p>
      <div className="result-share-actions">
        <a
          href={xHref}
          className="result-share-btn"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackShare("x")}
        >
          Xで投稿
        </a>
        <a
          href={lineHref}
          className="result-share-btn"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackShare("line")}
        >
          LINEで送る
        </a>
        {canNativeShare ? (
          <button
            type="button"
            className="result-share-btn"
            onClick={onNativeShare}
          >
            ほかのアプリ
          </button>
        ) : null}
      </div>
    </div>
  );
}
