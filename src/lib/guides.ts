import { SITE_NAME } from "@/lib/site";

export type GuideMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
};

export const GUIDES: GuideMeta[] = [
  {
    slug: "retirement-funds",
    title: "老後資金はいくら必要？目安の考え方",
    description:
      "老後資金の目安をどう置くか、生活費・期間・公的年金の考え方と、シミュレーターで目標を置く流れを解説します。投資助言ではありません。",
    publishedAt: "2026-07-12",
  },
  {
    slug: "nisa-simulation",
    title: "つみたてNISAシミュレーションの見方",
    description: `${SITE_NAME}の入力項目（年齢・積立・利回り・目標）の意味と、結果の読み方をわかりやすく解説します。`,
    publishedAt: "2026-07-12",
  },
  {
    slug: "4-percent-rule",
    title: "4%ルールとは？取り崩しの目安と注意点",
    description:
      "引退後の資産取り崩しで語られる4%ルールの概要と限界、当ツールでの簡易表示の位置づけを説明します。",
    publishedAt: "2026-07-12",
  },
];

export function getGuide(slug: string): GuideMeta | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}
