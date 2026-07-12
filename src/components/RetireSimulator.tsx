"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { GapHero } from "@/components/GapHero";
import { moodFromProgress } from "@/components/NisaruMascot";
import { ProgressJourney } from "@/components/ProgressJourney";
import { SoftAffiliateCta } from "@/components/SoftAffiliateCta";
import { StickyGapBar } from "@/components/StickyGapBar";

type Simulation = {
  yearsToTarget: number;
  ageAtTarget: number;
  monthsToTarget: number;
  amountAtRetire: number;
  targetReached: boolean;
  gapAmount: number;
  requiredMonthlyContribution: number;
  progressRatio: number;
  monthlyPassiveIncome: number;
};

function simulateRetirePlan(
  currentAge: number,
  retireAge: number,
  currentAmount: number,
  monthlyContribution: number,
  annualReturnPercent: number,
  targetAmount: number,
): Simulation {
  const years = Math.max(retireAge - currentAge, 0);
  const monthlyRate = annualReturnPercent / 100 / 12;
  const months = years * 12;

  let amount = currentAmount;
  for (let i = 0; i < months; i += 1) {
    amount = amount * (1 + monthlyRate) + monthlyContribution;
  }

  const amountAtRetire = Math.round(amount);
  const safeTarget = Math.max(targetAmount, 1);
  const targetReached = amountAtRetire >= targetAmount;
  const gapAmount = Math.max(targetAmount - amountAtRetire, 0);
  // Projected retirement assets vs target — so age / contribution / return
  // all move progress, journey, and mascot in realtime.
  const progressRatio = Math.min(amountAtRetire / safeTarget, 1);
  const monthlyPassiveIncome = Math.round((amountAtRetire * 0.04) / 12);

  let requiredMonthlyContribution = 0;
  if (months > 0) {
    if (monthlyRate === 0) {
      requiredMonthlyContribution = Math.max(
        (targetAmount - currentAmount) / months,
        0,
      );
    } else {
      const growth = (1 + monthlyRate) ** months;
      const numerator = targetAmount - currentAmount * growth;
      const denominator = (growth - 1) / monthlyRate;
      requiredMonthlyContribution = Math.max(numerator / denominator, 0);
    }
  }

  return {
    yearsToTarget: years,
    ageAtTarget: retireAge,
    monthsToTarget: months,
    amountAtRetire,
    targetReached,
    gapAmount,
    requiredMonthlyContribution: Math.round(requiredMonthlyContribution),
    progressRatio,
    monthlyPassiveIncome,
  };
}

const yen = new Intl.NumberFormat("ja-JP");

/** Parse input text; empty/invalid keeps the previous valid number (no zero flash). */
function parseKeepingLast(raw: string, lastValid: number): number {
  const trimmed = raw.trim();
  if (trimmed === "") return lastValid;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : lastValid;
}

function useNumericInput(initial: string) {
  const [raw, setRaw] = useState(initial);
  const lastValidRef = useRef(Number(initial));
  const trimmed = raw.trim();
  if (trimmed !== "") {
    const n = Number(trimmed);
    if (Number.isFinite(n)) lastValidRef.current = n;
  }
  const value = parseKeepingLast(raw, lastValidRef.current);
  return [raw, setRaw, value] as const;
}

type RetireSimulatorProps = {
  children?: ReactNode;
};

export function RetireSimulator({ children }: RetireSimulatorProps) {
  const [currentAgeRaw, setCurrentAge, currentAge] = useNumericInput("32");
  const [retireAgeRaw, setRetireAge, retireAge] = useNumericInput("60");
  const [currentAmountRaw, setCurrentAmount, currentAmount] =
    useNumericInput("1200000");
  const [monthlyContributionRaw, setMonthlyContribution, monthlyContribution] =
    useNumericInput("33000");
  const [annualReturnPercentRaw, setAnnualReturnPercent, annualReturnPercent] =
    useNumericInput("5");
  const [targetAmountRaw, setTargetAmount, targetAmount] =
    useNumericInput("40000000");

  const result = useMemo(
    () =>
      simulateRetirePlan(
        currentAge,
        retireAge,
        currentAmount,
        monthlyContribution,
        annualReturnPercent,
        targetAmount,
      ),
    [
      annualReturnPercent,
      currentAge,
      currentAmount,
      monthlyContribution,
      retireAge,
      targetAmount,
    ],
  );

  const progressPercent = Math.round(result.progressRatio * 100);
  const milestoneStep = 5_000_000;
  const nextMilestone =
    Math.ceil((currentAmount + 1) / milestoneStep) * milestoneStep;
  const milestoneLeft = Math.max(nextMilestone - currentAmount, 0);

  const momentumMessage = (() => {
    if (result.targetReached) return "達成コース！このままいこう。";
    if (progressPercent >= 70) return "ゴールが見えてきた！";
    if (progressPercent >= 40) return "折り返し地点。あと半分！";
    if (progressPercent >= 20) return "いいスタート。その調子。";
    return "コツコツ積めば、届く。";
  })();
  const mood = moodFromProgress(progressPercent, result.targetReached);

  function boostContribution(step: number) {
    setMonthlyContribution(String(monthlyContribution + step));
  }

  return (
    <>
      <StickyGapBar
        gapAmount={result.gapAmount}
        targetReached={result.targetReached}
        progressPercent={progressPercent}
        yearsToTarget={result.yearsToTarget}
        onBoost={boostContribution}
      />

      <main className="home-main mx-auto w-full max-w-3xl flex-1 px-5 pb-10 pt-6 sm:px-6 sm:pb-12 sm:pt-8">
        {/* Hero: brand + gap as one composition (no section chrome) */}
        <div id="gap" className="home-block home-block-hero">
          <GapHero
            amountAtRetire={result.amountAtRetire}
            targetAmount={targetAmount}
            gapAmount={result.gapAmount}
            targetReached={result.targetReached}
            progressPercent={progressPercent}
            yearsToTarget={result.yearsToTarget}
            momentumMessage={momentumMessage}
            mood={mood}
          />
        </div>

        <section
          id="journey"
          className="home-block home-block-journey"
          aria-labelledby="journey-heading"
        >
          <h2 className="section-anchor" id="journey-heading">
            <span className="section-anchor-num">01</span>
            道のり
          </h2>
          <ProgressJourney
            progressPercent={progressPercent}
            currentAmount={result.amountAtRetire}
            targetAmount={targetAmount}
            targetReached={result.targetReached}
          />
        </section>

        <section
          id="act"
          className="home-block home-block-act"
          aria-labelledby="motivation-heading"
        >
          <p className="section-anchor">
            <span className="section-anchor-num">02</span>
            アクション
          </p>
          <div className="motivation-board">
            <div className="motivation-board-header">
              <h2 id="motivation-heading" className="motivation-board-title">
                ギャップを縮める
              </h2>
              <p className="motivation-board-lead">
                積立を少し増やすと、差がリアルタイムで縮む。
              </p>
            </div>

            {result.targetReached ? (
              <p className="motivation-reached">
                目標達成見込みです（{result.ageAtTarget}歳）
              </p>
            ) : (
              <>
                <p className="motivation-need">
                  達成に必要な毎月積立{" "}
                  <strong>
                    ¥{yen.format(result.requiredMonthlyContribution)}
                  </strong>
                  <span className="motivation-need-now">
                    （いま ¥{yen.format(monthlyContribution)}）
                  </span>
                </p>
                <div className="boost-row">
                  <button
                    type="button"
                    className="boost-btn"
                    onClick={() => boostContribution(5000)}
                  >
                    +5,000円
                  </button>
                  <button
                    type="button"
                    className="boost-btn"
                    onClick={() => boostContribution(10000)}
                  >
                    +10,000円
                  </button>
                  <button
                    type="button"
                    className="boost-btn boost-btn-strong"
                    onClick={() => boostContribution(20000)}
                  >
                    +20,000円
                  </button>
                </div>
              </>
            )}

            <dl className="motivation-stats">
              <div>
                <dt>現在の運用資産</dt>
                <dd>¥{yen.format(currentAmount)}</dd>
                <span className="motivation-stat-sub">
                  次まで あと ¥{yen.format(milestoneLeft)}
                </span>
              </div>
              <div>
                <dt>想定取り崩し（月・4%）</dt>
                <dd>¥{yen.format(result.monthlyPassiveIncome)}</dd>
                <span className="motivation-stat-sub">
                  年 ¥{yen.format(result.monthlyPassiveIncome * 12)}
                </span>
              </div>
              <div>
                <dt>引退まで</dt>
                <dd>{result.yearsToTarget} 年</dd>
                <span className="motivation-stat-sub">
                  {result.monthsToTarget} ヶ月 · {result.ageAtTarget}歳
                </span>
              </div>
            </dl>

            <SoftAffiliateCta placement="motivation_board" className="mt-4" />
          </div>
        </section>

        <section
          id="inputs"
          className="home-block home-block-inputs"
          aria-labelledby="inputs-heading"
        >
          <h2 className="section-anchor" id="inputs-heading">
            <span className="section-anchor-num">03</span>
            条件
          </h2>
          <details className="inputs-disclosure">
            <summary className="inputs-disclosure-summary">
              <span className="inputs-disclosure-title">条件を変える</span>
              <span className="inputs-disclosure-hint">
                年齢・積立・目標など
              </span>
            </summary>
            <div className="inputs-disclosure-body">
              <div className="inputs-grid">
                <label className="input-field">
                  <span>現在の年齢</span>
                  <input
                    type="number"
                    value={currentAgeRaw}
                    onChange={(e) => setCurrentAge(e.target.value)}
                  />
                </label>

                <label className="input-field">
                  <span>引退したい年齢</span>
                  <input
                    type="number"
                    value={retireAgeRaw}
                    onChange={(e) => setRetireAge(e.target.value)}
                  />
                </label>

                <label className="input-field">
                  <span>現在の運用資産（円）</span>
                  <input
                    type="number"
                    value={currentAmountRaw}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                  />
                </label>

                <label className="input-field">
                  <span>毎月の積立額（円）</span>
                  <input
                    type="number"
                    value={monthlyContributionRaw}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                  />
                </label>

                <label className="input-field">
                  <span>想定年利（%）</span>
                  <input
                    type="number"
                    step="0.1"
                    value={annualReturnPercentRaw}
                    onChange={(e) => setAnnualReturnPercent(e.target.value)}
                  />
                </label>

                <label className="input-field">
                  <span>目標資産額（円）</span>
                  <input
                    type="number"
                    value={targetAmountRaw}
                    onChange={(e) => setTargetAmount(e.target.value)}
                  />
                </label>
              </div>
              <p className="inputs-note">
                数値はすぐにギャップと道のりへ反映されます。進捗は「引退時の想定資産
                ÷ 目標」です（現在資産そのものではありません）。
              </p>
            </div>
          </details>
        </section>

        <SoftAffiliateCta placement="result_summary" className="home-block" />

        {children}
      </main>
    </>
  );
}
