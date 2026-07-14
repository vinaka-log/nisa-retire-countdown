import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { GuideCta } from "@/components/GuideCta";
import { GuideJsonLd } from "@/components/GuideJsonLd";
import { getGuide } from "@/lib/guides";
import { pageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site";

const guide = getGuide("4-percent-rule")!;

export const metadata = pageMetadata({
  title: guide.title,
  description: guide.description,
  path: `/guides/${guide.slug}`,
  ogType: "article",
  publishedTime: guide.publishedAt,
  modifiedTime: guide.updatedAt,
});

export default function FourPercentRuleGuidePage() {
  return (
    <>
      <GuideJsonLd guide={guide} />
      <ContentPage title={guide.title} description={guide.description}>
        <ContentSection title="4%ルールの概要">
          <p>
            「4%ルール」は、引退後に資産を取り崩す際の目安として語られる考え方のひとつです。ざっくり言うと、引退時点の資産のおよそ年4%を取り崩す、という仮定で、長く資産を維持できるかどうかを議論する文脈で使われることがあります。
          </p>
          <p>
            議論の源流には、海外の市場データをもとにした研究（いわゆる Bengen の研究や Trinity Study などとして紹介されるもの）があります。前提が米国株・債券の歴史や当時の費用・税制に寄っていることが多く、
            <span className="font-medium text-zinc-900">
              日本の公的年金・物価・為替・税制にそのまま当てはまるとは限りません
            </span>
            。個人の支出・寿命・運用状況によっても適切さは変わります。
          </p>
        </ContentSection>

        <ContentSection title="数字のイメージ（計算の感覚）">
          <p>
            例として、引退時の金融資産が3,000万円なら、年4%は120万円、月あたりおよそ10万円です。これは「毎月いくら使えそうか」の粗い感覚を得るためのもので、その額を生涯保証するものではありません。
          </p>
          <p>
            実際の取り崩しでは、公的年金などの収入と合わせて支出を賄う、相場が悪い年は取り崩しを抑える、などの調整が話題になることもあります。当サイトではそうした高度な計画までは扱いません。
          </p>
        </ContentSection>

        <ContentSection title="限界と注意点">
          <ul className="list-disc space-y-2 pl-5">
            <li>過去の相場データに基づく議論であり、将来を保証しません。</li>
            <li>
              手数料・税金・インフレ・大きな相場下落・為替変動を十分に織り込んでいない場合があります。
            </li>
            <li>「年4%なら安全」といった一律の結論にはなりません。</li>
            <li>
              日本では公的年金が重要な収入源になるケースが多く、取り崩し率だけで家計全体を語れないことがあります。
            </li>
            <li>
              当サイトは投資助言業者ではなく、4%ルールの採用を推奨・勧誘するものではありません。
            </li>
          </ul>
        </ContentSection>

        <ContentSection title={`${SITE_NAME}での表示`}>
          <p>
            シミュレーターでは、引退時の想定資産に対して「想定取り崩し（月・4%）」を簡易表示しています。計算はおおよそ
            <span className="font-medium text-zinc-900">
              （引退時想定資産 × 0.04）÷ 12
            </span>
            です。学習・比較のための参考値であり、実際の取り崩し計画や商品選択の根拠には使えません。
          </p>
          <p>
            計算の前提や免責の詳細は
            <Link href="/faq" className="text-emerald-700 hover:underline">
              FAQ
            </Link>
            および
            <Link href="/disclaimer" className="text-emerald-700 hover:underline">
              免責事項
            </Link>
            をご覧ください。老後の目標額の置き方は
            <Link
              href="/guides/retirement-funds"
              className="text-emerald-700 hover:underline"
            >
              老後資金ガイド
            </Link>
            も参考にしてください。
          </p>
        </ContentSection>

        <GuideCta note="想定資産が変わると、月あたりの4%取り崩しイメージも連動して更新されます。" />

        <ContentSection title="関連ガイド">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <Link
                href="/guides/retirement-funds"
                className="text-emerald-700 hover:underline"
              >
                老後資金はいくら必要？
              </Link>
            </li>
            <li>
              <Link
                href="/guides/nisa-simulation"
                className="text-emerald-700 hover:underline"
              >
                つみたてNISAシミュレーションの見方
              </Link>
            </li>
            <li>
              <Link href="/guides" className="text-emerald-700 hover:underline">
                ガイド一覧
              </Link>
            </li>
          </ul>
        </ContentSection>
      </ContentPage>
    </>
  );
}
