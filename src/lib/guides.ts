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
    updatedAt: "2026-07-21",
  },
  {
    slug: "nisa-simulation",
    title: "つみたてNISAシミュレーションの見方",
    description: `${SITE_NAME}の入力項目の意味、年代別の使い方、想定年利の読み方、結果の解釈とよくある誤解をわかりやすく解説します。`,
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-21",
  },
  {
    slug: "4-percent-rule",
    title: "4%ルールと取り崩しシミュレーションの考え方",
    description:
      "4%ルールの概要、月あたり取り崩し額の計算例、シミュレーターでの見方、日本での注意点を解説します。投資助言ではありません。",
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-21",
  },
  {
    slug: "rogo-2000man",
    title: "老後2000万円問題とNISAでの目安",
    description:
      "老後2000万円問題の位置づけ、自分の不足額への置き換え方、NISA積立で目標に近づける考え方を解説します。投資助言ではありません。",
    publishedAt: "2026-07-21",
    updatedAt: "2026-07-21",
  },
  {
    slug: "monthly-contribution",
    title: "つみたてNISA 毎月いくらが目安か",
    description:
      "つみたてNISAで毎月いくら積み立てるかの考え方、目標から逆算する手順、シミュレーターでの試し方を解説します。投資助言ではありません。",
    publishedAt: "2026-07-21",
    updatedAt: "2026-07-21",
  },
  {
    slug: "points-and-gap",
    title: "積立余力を増やす：日常のポイントとギャップ",
    description:
      "積立額を増やす以外に、日常の支払いポイントを積立余力につなげる考え方を解説します。ギャップを縮めるもう一つの視点です。投資助言ではありません。",
    publishedAt: "2026-07-25",
    updatedAt: "2026-07-25",
  },
  {
    slug: "assumed-return",
    title: "想定年利の置き方（3%・5%・7%）",
    description:
      "積立シミュレーションで想定年利をどう置くか、3%・5%・7%の読み比べ方とよくある誤解を解説します。投資助言ではありません。",
    publishedAt: "2026-07-21",
    updatedAt: "2026-07-21",
  },
  {
    slug: "new-nisa-basics",
    title: "新NISAの枠の基本（つみたて／成長）",
    description:
      "新NISAのつみたて投資枠・成長投資枠の基本と、積立シミュレーションとの関係をわかりやすく整理します。投資助言ではありません。",
    publishedAt: "2026-07-21",
    updatedAt: "2026-07-21",
  },
  {
    slug: "nisa-vs-ideco",
    title: "NISAとiDeCoの違い（用途の切り分け）",
    description:
      "NISAとiDeCoの違いを用途・引き出し・税制の観点から整理し、老後目標の置き方につなげます。投資助言ではありません。",
    publishedAt: "2026-07-21",
    updatedAt: "2026-07-21",
  },
];

export function getGuide(slug: string): GuideMeta | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}
