"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { GapHero } from "@/components/GapHero";
import { moodFromProgress } from "@/components/NisaruMascot";
import { ProgressJourney } from "@/components/ProgressJourney";
import { SoftAffiliateCta } from "@/components/SoftAffiliateCta";
import { StepperInput } from "@/components/StepperInput";

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

function formatYen(n: number) {
  return yen.format(Math.round(n));
}

function parseYen(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, "");
  if (trimmed === "") return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function parseKeepingLast(raw: string, lastValid: number): number {
  const trimmed = raw.trim().replace(/,/g, "");
  if (trimmed === "") return lastValid;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : lastValid;
}

function useNumericInput(initial: string, formatDisplay?: (n: number) => string) {
  const [raw, setRaw] = useState(
    formatDisplay ? formatDisplay(Number(initial)) : initial,
  );
  const lastValidRef = useRef(Number(initial));
  const trimmed = raw.trim().replace(/,/g, "");
  if (trimmed !== "") {
    const n = Number(trimmed);
    if (Number.isFinite(n)) lastValidRef.current = n;
  }
  const value = parseKeepingLast(raw, lastValidRef.current);

  function setValue(next: number) {
    lastValidRef.current = next;
    setRaw(formatDisplay ? formatDisplay(next) : String(next));
  }

  return [raw, setRaw, value, setValue] as const;
}

type RetireSimulatorProps = {
  children?: ReactNode;
};

export function RetireSimulator({ children }: RetireSimulatorProps) {
  const [currentAgeRaw, setCurrentAgeRaw, currentAge, setCurrentAge] =
    useNumericInput("32");
  const [retireAgeRaw, setRetireAgeRaw, retireAge, setRetireAge] =
    useNumericInput("60");
  const [
    currentAmountRaw,
    setCurrentAmountRaw,
    currentAmount,
    setCurrentAmount,
  ] = useNumericInput("1200000", formatYen);
  const [
    monthlyContributionRaw,
    setMonthlyContributionRaw,
    monthlyContribution,
    setMonthlyContribution,
  ] = useNumericInput("33000", formatYen);
  const [
    annualReturnPercentRaw,
    setAnnualReturnPercentRaw,
    annualReturnPercent,
    setAnnualReturnPercent,
  ] = useNumericInput("5");
  const [targetAmountRaw, setTargetAmountRaw, targetAmount, setTargetAmount] =
    useNumericInput("40000000", formatYen);

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
    setMonthlyContribution(monthlyContribution + step);
  }

  /** Only raise retire age when current age would otherwise overtake it. */
  function handleCurrentAgeChange(next: number) {
    setCurrentAge(next);
    if (next > retireAge) {
      setRetireAge(next);
    }
  }

  function handleRetireAgeChange(next: number) {
    setRetireAge(Math.max(next, currentAge));
  }

  return (
    <>
      <main className="home-main mx-auto w-full max-w-3xl flex-1 px-5 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8">
        <div className="home-block home-block-intro">
          <h1 className="sim-headline">
            <span className="sim-headline-line">つみたてNISAで、</span>
            <span className="sim-headline-line">引退まであとどれくらい？</span>
          </h1>
          <p className="sim-lead">
            <span className="sim-lead-line">積立・利回り・目標を動かすと、</span>
            <span className="sim-lead-line">目標までの不足額がすぐわかります</span>
          </p>
        </div>

        <section
          id="inputs"
          className="home-block home-block-inputs"
          aria-labelledby="inputs-heading"
        >
          <div className="sim-panel">
            <div className="sim-panel-header">
              <h2 id="inputs-heading" className="sim-panel-title">
                条件を設定
              </h2>
              <p className="sim-panel-lead">
                スライダーか＋−で調整。数値はリアルタイム反映です。
              </p>
            </div>

            <div className="stepper-stack">
              <StepperInput
                label="現在の年齢"
                value={currentAge}
                raw={currentAgeRaw}
                onRawChange={setCurrentAgeRaw}
                onValueChange={handleCurrentAgeChange}
                min={18}
                max={80}
                step={1}
                unit="歳"
              />
              <StepperInput
                label="引退したい年齢"
                value={retireAge}
                raw={retireAgeRaw}
                onRawChange={setRetireAgeRaw}
                onValueChange={handleRetireAgeChange}
                min={Math.max(currentAge, 30)}
                max={90}
                step={1}
                unit="歳"
              />
              <StepperInput
                label="現在の運用資産"
                value={currentAmount}
                raw={currentAmountRaw}
                onRawChange={setCurrentAmountRaw}
                onValueChange={setCurrentAmount}
                min={0}
                max={100_000_000}
                step={100_000}
                unit="円"
                formatDisplay={formatYen}
                parseDisplay={parseYen}
              />
              <StepperInput
                label="毎月の積立額"
                value={monthlyContribution}
                raw={monthlyContributionRaw}
                onRawChange={setMonthlyContributionRaw}
                onValueChange={setMonthlyContribution}
                min={0}
                max={300_000}
                step={1_000}
                unit="円"
                formatDisplay={formatYen}
                parseDisplay={parseYen}
                hint="新NISAのつみたて投資枠の目安も参考に"
              />
              <StepperInput
                label="想定年利"
                value={annualReturnPercent}
                raw={annualReturnPercentRaw}
                onRawChange={setAnnualReturnPercentRaw}
                onValueChange={setAnnualReturnPercent}
                min={0}
                max={15}
                step={0.1}
                unit="%"
                hint="過去の株式指数の平均は目安のひとつ。保証ではありません"
              />
              <StepperInput
                label="目標資産額"
                value={targetAmount}
                raw={targetAmountRaw}
                onRawChange={setTargetAmountRaw}
                onValueChange={setTargetAmount}
                min={1_000_000}
                max={200_000_000}
                step={1_000_000}
                unit="円"
                formatDisplay={formatYen}
                parseDisplay={parseYen}
              />
            </div>
          </div>
        </section>

        <div id="result" className="home-block home-block-hero">
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

        <SoftAffiliateCta placement="result_summary" className="home-block" />

        {children}
      </main>
    </>
  );
}
