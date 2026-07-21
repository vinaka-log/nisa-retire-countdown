import Link from "next/link";

type GuideCtaProps = {
  note?: string;
};

export function GuideCta({
  note = "条件を変えると、ギャップと道のりがリアルタイムで更新されます。",
}: GuideCtaProps) {
  return (
    <p className="guide-cta">
      <Link href="/" className="guide-cta-link">
        無料シミュレーターで試す
      </Link>
      <span className="guide-cta-note">{note}</span>
    </p>
  );
}
