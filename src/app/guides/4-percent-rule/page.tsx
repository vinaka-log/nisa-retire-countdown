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
            もともとの研究や議論は海外の市場・税制・インフレ前提に基づくことが多く、日本の公的年金・物価・為替・税制にそのまま当てはまるとは限りません。個人の支出・寿命・運用状況によっても適切さは変わります。
          </p>
        </ContentSection>

        <ContentSection title="限界と注意点">
          <ul className="list-disc space-y-2 pl-5">
            <li>過去の相場データに基づく議論であり、将来を保証しません。</li>
            <li>手数料・税金・インフレ・大きな相場下落を十分に織り込んでいない場合があります。</li>
            <li>「年4%なら安全」といった一律の結論にはなりません。</li>
            <li>
              当サイトは投資助言業者ではなく、4%ルールの採用を推奨・勧誘するものではありません。
            </li>
          </ul>
        </ContentSection>

        <ContentSection title={`${SITE_NAME}での表示`}>
          <p>
            シミュレーターでは、引退時の想定資産に対して「想定取り崩し（月・4%）」を簡易表示しています。これは学習・比較のための参考値であり、実際の取り崩し計画や商品選択の根拠には使えません。
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
            をご覧ください。
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
