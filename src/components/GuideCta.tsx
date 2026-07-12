import Link from "next/link";

type GuideCtaProps = {
  note?: string;
};

export function GuideCta({
  note = "条件を変えると、ギャップと道のりがリアルタイムで更新されます。",
}: GuideCtaProps) {
  return (
    <p className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 px-4 py-3 text-sm leading-relaxed text-zinc-700 sm:text-base">
      <Link href="/" className="font-semibold text-emerald-800 hover:underline">
        無料シミュレーターで試す
      </Link>
      <span className="mt-1 block text-zinc-600">{note}</span>
    </p>
  );
}
