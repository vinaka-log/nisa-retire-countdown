"use client";

import { useMemo, useState } from "react";
import { moodFromProgress, NisaruMascot } from "@/components/NisaruMascot";
import { ProgressJourney } from "@/components/ProgressJourney";

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
  const targetReached = amountAtRetire >= targetAmount;
  const gapAmount = Math.max(targetAmount - amountAtRetire, 0);
  const progressRatio = Math.min(currentAmount / Math.max(targetAmount, 1), 1);
  const monthlyPassiveIncome = Math.round(amountAtRetire * 0.04 / 12);

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

export default function Home() {
  const [currentAge, setCurrentAge] = useState("32");
  const [retireAge, setRetireAge] = useState("60");
  const [currentAmount, setCurrentAmount] = useState("1200000");
  const [monthlyContribution, setMonthlyContribution] = useState("100000");
  const [annualReturnPercent, setAnnualReturnPercent] = useState("5");
  const [targetAmount, setTargetAmount] = useState("40000000");

  const toNumber = (value: string): number => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  const result = useMemo(
    () =>
      simulateRetirePlan(
        toNumber(currentAge),
        toNumber(retireAge),
        toNumber(currentAmount),
        toNumber(monthlyContribution),
        toNumber(annualReturnPercent),
        toNumber(targetAmount),
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
    Math.ceil((toNumber(currentAmount) + 1) / milestoneStep) * milestoneStep;
  const milestoneLeft = Math.max(nextMilestone - toNumber(currentAmount), 0);

  const momentumMessage = (() => {
    if (result.targetReached) return "達成コース！このままいこう。";
    if (progressPercent >= 70) return "ゴールが見えてきた！";
    if (progressPercent >= 40) return "折り返し地点。あと半分！";
    if (progressPercent >= 20) return "いいスタート。その調子。";
    return "コツコツ積めば、届く。";
  })();
  const mood = moodFromProgress(progressPercent, result.targetReached);

  function boostContribution(step: number) {
    const current = toNumber(monthlyContribution);
    setMonthlyContribution(String(current + step));
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-10">
      <section className="mb-8">
        <p className="mb-2 text-sm font-semibold tracking-wide text-emerald-700">
          つみたてNISA
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          あと何年で、引退？
        </h1>
        <p className="mt-3 text-lg font-medium text-amber-700">{momentumMessage}</p>
      </section>

      <section className="mb-6">
        <NisaruMascot
          mood={mood}
          progressPercent={progressPercent}
          yearsLeft={result.yearsToTarget}
        />
      </section>

      <section className="mb-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">引退まで</p>
          <p className="text-3xl font-bold">{result.yearsToTarget} 年</p>
          <p className="text-sm text-zinc-600">{result.monthsToTarget} ヶ月</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">引退時の想定取り崩し（月4%ルール）</p>
          <p className="text-3xl font-bold">¥{yen.format(result.monthlyPassiveIncome)}</p>
          <p className="text-sm text-zinc-600">年換算: ¥{yen.format(result.monthlyPassiveIncome * 12)}</p>
        </article>
      </section>

      <section className="mb-6">
        <ProgressJourney
          progressPercent={progressPercent}
          currentAmount={toNumber(currentAmount)}
          targetAmount={toNumber(targetAmount)}
          targetReached={result.targetReached}
        />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">入力</h2>
          <div className="grid gap-4">
            <label className="grid gap-1 text-sm">
              <span>現在の年齢</span>
              <input
                className="rounded-lg border border-zinc-300 px-3 py-2"
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span>引退したい年齢</span>
              <input
                className="rounded-lg border border-zinc-300 px-3 py-2"
                type="number"
                value={retireAge}
                onChange={(e) => setRetireAge(e.target.value)}
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span>現在の運用資産（円）</span>
              <input
                className="rounded-lg border border-zinc-300 px-3 py-2"
                type="number"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span>毎月の積立額（円）</span>
              <input
                className="rounded-lg border border-zinc-300 px-3 py-2"
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span>想定年利（%）</span>
              <input
                className="rounded-lg border border-zinc-300 px-3 py-2"
                type="number"
                step="0.1"
                value={annualReturnPercent}
                onChange={(e) => setAnnualReturnPercent(e.target.value)}
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span>目標資産額（円）</span>
              <input
                className="rounded-lg border border-zinc-300 px-3 py-2"
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
          <h2 className="mb-4 text-lg font-semibold">モチベーションボード</h2>
          <div className="space-y-4">
            <div className="rounded-xl bg-white p-4">
              <p className="text-sm text-zinc-500">現在資産</p>
              <p className="text-2xl font-bold">¥{yen.format(toNumber(currentAmount))}</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <p className="text-sm text-zinc-500">次のマイルストーン</p>
              <p className="text-2xl font-bold">¥{yen.format(nextMilestone)}</p>
              <p className="text-sm text-zinc-700">
                あと ¥{yen.format(milestoneLeft)}
              </p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <p className="text-sm text-zinc-500">この目標に必要な毎月積立</p>
              <p className="text-2xl font-bold">
                ¥{yen.format(result.requiredMonthlyContribution)}
              </p>
            </div>
            <div className="rounded-xl bg-white p-4">
              {result.targetReached ? (
                <p className="font-semibold text-emerald-700">
                  目標達成見込みです（{result.ageAtTarget}歳）
                </p>
              ) : (
                <>
                  <p className="font-semibold text-amber-700">
                    目標まであと ¥{yen.format(result.gapAmount)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100"
                      onClick={() => boostContribution(5000)}
                    >
                      積立 +5,000円
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100"
                      onClick={() => boostContribution(10000)}
                    >
                      積立 +10,000円
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100"
                      onClick={() => boostContribution(20000)}
                    >
                      積立 +20,000円
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
        収益化向け次ステップ: 日次チェックイン、目標達成バッジ、Proで詳細分析・税引後シミュレーション。
      </section>
    </main>
  );
}
