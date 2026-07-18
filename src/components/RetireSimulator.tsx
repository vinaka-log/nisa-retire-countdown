"use client";

import { useMemo, useState, type ReactNode } from "react";
import { GapHero } from "@/components/GapHero";
import { moodFromProgress } from "@/components/NisaruMascot";
import { ProgressJourney } from "@/components/ProgressJourney";
import { SoftAffiliateCta } from "@/components/SoftAffiliateCta";
import { StepperInput } from "@/components/StepperInput";
import {
  formatReturnPercent,
  formatYen,
  parseReturnPercent,
  parseYen,
} from "@/lib/format";
import {
  INPUT_LIMITS,
  constrainInput,
  simulateRetirePlan,
} from "@/lib/retire-simulation";

/**
 * Keeps a freeform text draft (`raw`) separate from the committed number
 * (`value`). Typing only updates `raw`; simulation / slider use `value`
 * until blur, Enter, slider, or +/- commits via setValue.
 */
function useNumericInput(
  initial: string,
  formatDisplay?: (n: number) => string,
) {
  const initialNumber = Number(initial);
  const [raw, setRaw] = useState(
    formatDisplay ? formatDisplay(initialNumber) : initial,
  );
  const [value, setValueState] = useState(initialNumber);

  function setValue(next: number) {
    setValueState(next);
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
  ] = useNumericInput("5", formatReturnPercent);
  const [targetAmountRaw, setTargetAmountRaw, targetAmount, setTargetAmount] =
    useNumericInput("40000000", formatYen);

  const result = useMemo(
    () =>
      simulateRetirePlan({
        currentAge,
        retireAge,
        currentAmount,
        monthlyContribution,
        annualReturnPercent,
        targetAmount,
      }),
    [
      annualReturnPercent,
      currentAge,
      currentAmount,
      monthlyContribution,
      retireAge,
      targetAmount,
    ],
  );

  const {
    input: simInput,
    progressPercent,
    amountAtRetire,
    gapAmount,
    targetReached,
    yearsToTarget,
    ageAtTarget,
    monthsToTarget,
    requiredMonthlyContribution,
    monthlyPassiveIncome,
    annualPassiveIncome,
  } = result;

  const milestoneStep = 5_000_000;
  const nextMilestone =
    Math.ceil((simInput.currentAmount + 1) / milestoneStep) * milestoneStep;
  const milestoneLeft = Math.max(nextMilestone - simInput.currentAmount, 0);

  const momentumMessage = (() => {
    if (targetReached) return "達成コース！このままいこう。";
    if (progressPercent >= 70) return "ゴールが見えてきた！";
    if (progressPercent >= 40) return "折り返し地点。あと半分！";
    if (progressPercent >= 20) return "いいスタート。その調子。";
    return "コツコツ積めば、届く。";
  })();
  const mood = moodFromProgress(progressPercent, targetReached);

  function boostContribution(step: number) {
    setMonthlyContribution(
      constrainInput("monthlyContribution", monthlyContribution + step),
    );
  }

  function handleCurrentAgeChange(next: number) {
    const age = constrainInput("currentAge", next);
    setCurrentAge(age);
    if (age > retireAge) {
      setRetireAge(age);
    }
  }

  function handleRetireAgeChange(next: number) {
    setRetireAge(Math.max(constrainInput("retireAge", next), currentAge));
  }

  const retireAgeMin = Math.max(currentAge, INPUT_LIMITS.retireAge.min);
  const monthlyMax = INPUT_LIMITS.monthlyContribution.max;

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
                数値を直接入力（確定は Enter か枠外タップ）するか、スライダー・＋−で調整できます。
              </p>
            </div>

            <div className="stepper-stack">
              <StepperInput
                label="現在の年齢"
                value={currentAge}
                raw={currentAgeRaw}
                onRawChange={setCurrentAgeRaw}
                onValueChange={handleCurrentAgeChange}
                min={INPUT_LIMITS.currentAge.min}
                max={INPUT_LIMITS.currentAge.max}
                step={INPUT_LIMITS.currentAge.step}
                unit="歳"
              />
              <StepperInput
                label="引退したい年齢"
                value={retireAge}
                raw={retireAgeRaw}
                onRawChange={setRetireAgeRaw}
                onValueChange={handleRetireAgeChange}
                min={retireAgeMin}
                max={INPUT_LIMITS.retireAge.max}
                step={INPUT_LIMITS.retireAge.step}
                unit="歳"
              />
              <StepperInput
                label="現在の運用資産"
                value={currentAmount}
                raw={currentAmountRaw}
                onRawChange={setCurrentAmountRaw}
                onValueChange={(n) =>
                  setCurrentAmount(constrainInput("currentAmount", n))
                }
                min={INPUT_LIMITS.currentAmount.min}
                max={INPUT_LIMITS.currentAmount.max}
                step={INPUT_LIMITS.currentAmount.step}
                unit="円"
                formatDisplay={formatYen}
                parseDisplay={parseYen}
              />
              <StepperInput
                label="毎月の積立額"
                value={monthlyContribution}
                raw={monthlyContributionRaw}
                onRawChange={setMonthlyContributionRaw}
                onValueChange={(n) =>
                  setMonthlyContribution(
                    constrainInput("monthlyContribution", n),
                  )
                }
                min={INPUT_LIMITS.monthlyContribution.min}
                max={monthlyMax}
                step={INPUT_LIMITS.monthlyContribution.step}
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
                onValueChange={(n) =>
                  setAnnualReturnPercent(
                    constrainInput("annualReturnPercent", n),
                  )
                }
                min={INPUT_LIMITS.annualReturnPercent.min}
                max={INPUT_LIMITS.annualReturnPercent.max}
                step={INPUT_LIMITS.annualReturnPercent.step}
                unit="%"
                formatDisplay={formatReturnPercent}
                parseDisplay={parseReturnPercent}
                hint="過去の株式指数の平均は目安のひとつ。保証ではありません"
              />
              <StepperInput
                label="目標資産額"
                value={targetAmount}
                raw={targetAmountRaw}
                onRawChange={setTargetAmountRaw}
                onValueChange={(n) =>
                  setTargetAmount(constrainInput("targetAmount", n))
                }
                min={INPUT_LIMITS.targetAmount.min}
                max={INPUT_LIMITS.targetAmount.max}
                step={INPUT_LIMITS.targetAmount.step}
                unit="円"
                formatDisplay={formatYen}
                parseDisplay={parseYen}
              />
            </div>
          </div>
        </section>

        <div id="result" className="home-block home-block-hero">
          <GapHero
            amountAtRetire={amountAtRetire}
            targetAmount={simInput.targetAmount}
            gapAmount={gapAmount}
            targetReached={targetReached}
            progressPercent={progressPercent}
            yearsToTarget={yearsToTarget}
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
            amountAtRetire={amountAtRetire}
            targetAmount={simInput.targetAmount}
            gapAmount={gapAmount}
            targetReached={targetReached}
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

            {targetReached ? (
              <p className="motivation-reached">
                目標達成見込みです（{ageAtTarget}歳）
              </p>
            ) : (
              <>
                <p className="motivation-need">
                  達成に必要な毎月積立{" "}
                  <strong>¥{formatYen(requiredMonthlyContribution)}</strong>
                  <span className="motivation-need-now">
                    （いま ¥{formatYen(simInput.monthlyContribution)}）
                  </span>
                </p>
                <div className="boost-row">
                  <button
                    type="button"
                    className="boost-btn"
                    onClick={() => boostContribution(5000)}
                    disabled={monthlyContribution >= monthlyMax}
                  >
                    +5,000円
                  </button>
                  <button
                    type="button"
                    className="boost-btn"
                    onClick={() => boostContribution(10000)}
                    disabled={monthlyContribution >= monthlyMax}
                  >
                    +10,000円
                  </button>
                  <button
                    type="button"
                    className="boost-btn boost-btn-strong"
                    onClick={() => boostContribution(20000)}
                    disabled={monthlyContribution >= monthlyMax}
                  >
                    +20,000円
                  </button>
                </div>
              </>
            )}

            <dl className="motivation-stats">
              <div>
                <dt>現在の運用資産</dt>
                <dd>¥{formatYen(simInput.currentAmount)}</dd>
                <span className="motivation-stat-sub">
                  次まで あと ¥{formatYen(milestoneLeft)}
                </span>
              </div>
              <div>
                <dt>想定取り崩し（月・4%）</dt>
                <dd>¥{formatYen(monthlyPassiveIncome)}</dd>
                <span className="motivation-stat-sub">
                  年 ¥{formatYen(annualPassiveIncome)}
                </span>
              </div>
              <div>
                <dt>引退まで</dt>
                <dd>{yearsToTarget} 年</dd>
                <span className="motivation-stat-sub">
                  {monthsToTarget} ヶ月 · {ageAtTarget}歳
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
