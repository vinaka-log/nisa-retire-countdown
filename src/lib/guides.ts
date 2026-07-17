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
      "老後資金の目安を、生活費・期間・公的年金の差分から逆算する考え方、独身・夫婦の違い、具体例とシミュレーターでの目標の置き方を解説します。投資助言ではありません。",
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-17",
  },
  {
    slug: "nisa-simulation",
    title: "つみたてNISAシミュレーションの見方",
    description: `${SITE_NAME}の入力項目の意味、年代別の使い方、想定年利の読み方、結果の解釈とよくある誤解をわかりやすく解説します。`,
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-17",
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
