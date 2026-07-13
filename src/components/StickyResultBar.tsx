"use client";

const yen = new Intl.NumberFormat("ja-JP");

type Props = {
  gapAmount: number;
  amountAtRetire: number;
  targetReached: boolean;
  progressPercent: number;
  yearsToTarget?: number;
};

/**
 * Bottom sticky result — always visible while adjusting inputs (nisa-sim pattern).
 */
export function StickyResultBar({
  gapAmount,
  amountAtRetire,
  targetReached,
  progressPercent,
  yearsToTarget,
}: Props) {
  return (
    <div className="sticky-result-bar" role="status" aria-live="polite">
      <div className="sticky-result-bar-inner">
        <div className="sticky-result-bar-text">
          <span className="sticky-result-bar-label">
            {targetReached ? "目標達成コース" : "目標まであと"}
          </span>
          <span
            className={`sticky-result-bar-amount ${targetReached ? "is-reached" : ""}`}
          >
            {targetReached ? "達成！" : `¥${yen.format(gapAmount)}`}
          </span>
        </div>
        <div className="sticky-result-bar-meta">
          <span>引退時想定 ¥{yen.format(amountAtRetire)}</span>
          <span>
            {progressPercent}%
            {typeof yearsToTarget === "number" && yearsToTarget > 0
              ? ` · ${yearsToTarget}年`
              : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
