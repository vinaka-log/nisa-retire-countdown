import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { GuideCta } from "@/components/GuideCta";
import { SoftAffiliateCta } from "@/components/SoftAffiliateCta";
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

        <ContentSection title="取り崩しシミュレーションの手順（簡易）">
          <p>
            「4%ルール 取り崩しシミュレーション」と検索されるときによく知りたいのは、
            <span className="font-medium text-zinc-900">
              引退時の資産から、月にいくらくらい取り崩すイメージになるか
            </span>
            です。当サイトでの簡易な流れは次のとおりです。
          </p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <Link href="/guides/retirement-funds" className="text-emerald-700 hover:underline">
                老後資金ガイド
              </Link>
              を参考に、目標資産額（引退時に欲しいストック）のたたき台を置く。
            </li>
            <li>
              シミュレーターに年齢・積立・想定年利・目標を入れ、引退時の想定資産を確認する。
            </li>
            <li>
              結果の「想定取り崩し（月・4%）」で、年4%仮定の月額イメージを見る。
            </li>
            <li>
              公的年金などの収入と足し合わせ、「毎月の生活費に届きそうか」をざっくり比較する（精密な家計設計ではありません）。
            </li>
          </ol>
        </ContentSection>

        <ContentSection title="数字のイメージ（計算例）">
          <p>
            計算式はおおよそ
            <span className="font-medium text-zinc-900">
              （引退時の資産 × 0.04）÷ 12
            </span>
            です。
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-zinc-900">2,000万円</span>
              — 年80万円、月あたり約6.7万円
            </li>
            <li>
              <span className="font-medium text-zinc-900">3,000万円</span>
              — 年120万円、月あたり約10万円
            </li>
            <li>
              <span className="font-medium text-zinc-900">5,000万円</span>
              — 年200万円、月あたり約16.7万円
            </li>
          </ul>
          <p>
            これは「毎月いくら使えそうか」の粗い感覚を得るためのもので、その額を生涯保証するものではありません。実際の取り崩しでは、公的年金と合わせる、相場が悪い年は抑える、などの調整が話題になることもあります。当サイトでは高度な計画までは扱いません。
          </p>
        </ContentSection>

        <ContentSection title={`${SITE_NAME}の表示との対応`}>
          <p>
            シミュレーターでは、引退時の想定資産に対して「想定取り崩し（月・4%）」を簡易表示しています。積立や利回りを変えると引退時想定が変わり、取り崩しイメージも連動します。
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-zinc-900">目標まであと</span>
              — 目標資産と引退時想定のギャップ
            </li>
            <li>
              <span className="font-medium text-zinc-900">想定取り崩し（月・4%）</span>
              — 上記の年4%÷12の参考値
            </li>
            <li>
              <span className="font-medium text-zinc-900">達成に必要な毎月積立</span>
              — 同じ年数・利回りの仮定で目標に届く積立の目安
            </li>
          </ul>
          <p>
            学習・比較のための参考値であり、実際の取り崩し計画や商品選択の根拠には使えません。入力項目の意味は
            <Link
              href="/guides/nisa-simulation"
              className="text-emerald-700 hover:underline"
            >
              シミュレーションの見方
            </Link>
            も参照してください。
          </p>
        </ContentSection>

        <ContentSection title="よくある誤解">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-zinc-900">
                「年4%なら必ず資産が尽きない」
              </span>
              — 過去データに基づく議論であり、将来を保証しません。
            </li>
            <li>
              <span className="font-medium text-zinc-900">
                「表示の月額がそのまま使える生活費」
              </span>
              — 公的年金・税金・医療費などは別途考える必要があります。
            </li>
            <li>
              <span className="font-medium text-zinc-900">
                「日本でも海外研究と同じ前提でよい」
              </span>
              — 物価・為替・税制・年金制度が異なるため、そのまま当てはまるとは限りません。
            </li>
            <li>
              <span className="font-medium text-zinc-900">
                「シミュレーション結果で商品を選んでよい」
              </span>
              — 当ツールは概算の学習用です。投資判断の根拠には使えません。
            </li>
          </ul>
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

        <SoftAffiliateCta placement="guide" />

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
                href="/guides/rogo-2000man"
                className="text-emerald-700 hover:underline"
              >
                老後2000万円問題とNISAでの目安
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
