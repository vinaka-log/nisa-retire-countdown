"use client";

import { useMemo, useState } from "react";

type Simulation = {
  yearsToTarget: number;
  ageAtTarget: number;
  amountAtRetire: number;
  targetReached: boolean;
  gapAmount: number;
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

  let amount = currentAmount;
  for (let i = 0; i < years * 12; i += 1) {
    amount = amount * (1 + monthlyRate) + monthlyContribution;
  }

  const amountAtRetire = Math.round(amount);
  const targetReached = amountAtRetire >= targetAmount;
  const gapAmount = Math.max(targetAmount - amountAtRetire, 0);

  return {
    yearsToTarget: years,
    ageAtTarget: retireAge,
    amountAtRetire,
    targetReached,
    gapAmount,
  };
}

const yen = new Intl.NumberFormat("ja-JP");

export default function Home() {
  const [currentAge, setCurrentAge] = useState(32);
  const [retireAge, setRetireAge] = useState(60);
  const [currentAmount, setCurrentAmount] = useState(1_200_000);
  const [monthlyContribution, setMonthlyContribution] = useState(100_000);
  const [annualReturnPercent, setAnnualReturnPercent] = useState(5);
  const [targetAmount, setTargetAmount] = useState(40_000_000);

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

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-10">
      <section className="mb-8">
        <p className="mb-2 text-sm text-zinc-500">積み立てNISA FIRE planner</p>
        <h1 className="text-3xl font-bold tracking-tight">
          引退までのカウントダウンを見える化
        </h1>
        <p className="mt-3 text-zinc-600">
          まずはMVPとして、積み立てNISAの想定利回りから「何歳で目標資産に届くか」をシミュレーションできます。
        </p>
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
                onChange={(e) => setCurrentAge(Number(e.target.value))}
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span>引退したい年齢</span>
              <input
                className="rounded-lg border border-zinc-300 px-3 py-2"
                type="number"
                value={retireAge}
                onChange={(e) => setRetireAge(Number(e.target.value))}
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span>現在の運用資産（円）</span>
              <input
                className="rounded-lg border border-zinc-300 px-3 py-2"
                type="number"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(Number(e.target.value))}
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span>毎月の積立額（円）</span>
              <input
                className="rounded-lg border border-zinc-300 px-3 py-2"
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span>想定年利（%）</span>
              <input
                className="rounded-lg border border-zinc-300 px-3 py-2"
                type="number"
                step="0.1"
                value={annualReturnPercent}
                onChange={(e) => setAnnualReturnPercent(Number(e.target.value))}
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span>目標資産額（円）</span>
              <input
                className="rounded-lg border border-zinc-300 px-3 py-2"
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
              />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
          <h2 className="mb-4 text-lg font-semibold">結果</h2>
          <div className="space-y-4">
            <div className="rounded-xl bg-white p-4">
              <p className="text-sm text-zinc-500">引退まで</p>
              <p className="text-2xl font-bold">{result.yearsToTarget} 年</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <p className="text-sm text-zinc-500">引退時の想定資産</p>
              <p className="text-2xl font-bold">¥{yen.format(result.amountAtRetire)}</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              {result.targetReached ? (
                <p className="font-semibold text-emerald-700">
                  目標達成見込みです（{result.ageAtTarget}歳）
                </p>
              ) : (
                <p className="font-semibold text-amber-700">
                  目標まであと ¥{yen.format(result.gapAmount)}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
        次ステップ（収益化向け）: ログイン保存、複数シナリオ比較、通知、Proプラン（詳細分析）を追加予定。
      </section>
    </main>
  );
}
