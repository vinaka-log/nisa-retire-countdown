import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { GuideCta } from "@/components/GuideCta";
import { GuideJsonLd } from "@/components/GuideJsonLd";
import { getGuide } from "@/lib/guides";
import { pageMetadata } from "@/lib/page-metadata";

const guide = getGuide("retirement-funds")!;

export const metadata = pageMetadata({
  title: guide.title,
  description: guide.description,
  path: `/guides/${guide.slug}`,
});

export default function RetirementFundsGuidePage() {
  return (
    <>
      <GuideJsonLd guide={guide} />
      <ContentPage title={guide.title} description={guide.description}>
        <ContentSection title="はじめに">
          <p>
            「老後資金はいくら必要か」は、生活水準・引退後の年数・公的年金・医療や介護の備えなどで大きく変わります。万人に共通する正解の金額はありません。ここでは、目安を置くときの考え方と、シミュレーターで目標を設定する流れを整理します。
          </p>
          <p>
            当サイトの情報は一般的な学習・検討の補助であり、投資助言や特定商品の推奨ではありません。詳細は
            <Link href="/disclaimer" className="text-emerald-700 hover:underline">
              免責事項
            </Link>
            をご確認ください。
          </p>
        </ContentSection>

        <ContentSection title="目安を置くときの3つの軸">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-zinc-900">毎月（または年間）の生活費</span>
              — 住居・食費・医療・趣味など、引退後に想定する支出のイメージ。
            </li>
            <li>
              <span className="font-medium text-zinc-900">何年分を見込むか</span>
              — 引退年齢から平均余命だけでなく、余裕を見た年数で考える人もいます。
            </li>
            <li>
              <span className="font-medium text-zinc-900">公的年金など別途入る収入</span>
              — 不足分だけを自前の資産でまかなう、という置き方も一般的です。
            </li>
          </ul>
          <p>
            よく話題になる「○千万円」といった数字は、特定の前提での一例に過ぎません。自分の支出と収入の差から逆算する方が、目標として使いやすいことが多いです。
          </p>
        </ContentSection>

        <ContentSection title="シミュレーターでの使い方">
          <ol className="list-decimal space-y-2 pl-5">
            <li>いまの年齢と、引退したい年齢を入れる。</li>
            <li>現在の運用資産と、毎月の積立額・想定年利を入れる。</li>
            <li>
              「目標資産額」に、上で考えた目安（例: 不足分の総額）を置く。
            </li>
            <li>
              表示されるギャップや「達成に必要な毎月積立」を見ながら、積立を増やす・目標を見直す・引退年齢をずらす、などを比較する。
            </li>
          </ol>
          <p>
            進捗は「引退時の想定資産 ÷ 目標」です。現在資産そのものの達成率ではありません。計算は複利と積立を単純化した概算で、手数料・税金・相場変動は含みません。
          </p>
        </ContentSection>

        <GuideCta note="目標額を変えると、ギャップと必要な積立額がすぐに更新されます。" />

        <ContentSection title="関連ガイド">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <Link
                href="/guides/nisa-simulation"
                className="text-emerald-700 hover:underline"
              >
                つみたてNISAシミュレーションの見方
              </Link>
            </li>
            <li>
              <Link
                href="/guides/4-percent-rule"
                className="text-emerald-700 hover:underline"
              >
                4%ルールとは？
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
