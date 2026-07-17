import { SITE_NAME } from "@/lib/site";

export type GuideMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
};

export const GUIDES: GuideMeta[] = [
  {
    slug: "retirement-funds",
    title: "老後資金はいくら必要？目安の考え方",
    description:
      "老後資金の目安を、生活費・期間・公的年金の差分から逆算する考え方と、シミュレーターで目標を置く流れを解説します。投資助言ではありません。",
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-14",
  },
  {
    slug: "nisa-simulation",
    title: "つみたてNISAシミュレーションの見方",
    description: `${SITE_NAME}の入力項目（年齢・積立・利回り・目標）の意味と、結果の読み方・よくある誤解をわかりやすく解説します。`,
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-14",
  },
  {
    slug: "4-percent-rule",
    title: "4%ルールと取り崩しシミュレーションの考え方",
    description:
      "4%ルールの概要、月あたり取り崩し額の計算例、シミュレーターでの見方、日本での注意点を解説します。投資助言ではありません。",
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-17",
  },
];

export function getGuide(slug: string): GuideMeta | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}
