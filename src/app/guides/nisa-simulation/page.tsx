import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { GuideCta } from "@/components/GuideCta";
import { GuideJsonLd } from "@/components/GuideJsonLd";
import { getGuide } from "@/lib/guides";
import { pageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site";

const guide = getGuide("nisa-simulation")!;

export const metadata = pageMetadata({
  title: guide.title,
  description: guide.description,
  path: `/guides/${guide.slug}`,
  ogType: "article",
  publishedTime: guide.publishedAt,
  modifiedTime: guide.updatedAt,
});

export default function NisaSimulationGuidePage() {
  return (
    <>
      <GuideJsonLd guide={guide} />
      <ContentPage title={guide.title} description={guide.description}>
        <ContentSection title="このシミュレーターで分かること">
          <p>
            {SITE_NAME}
            は、年齢・資産・毎月の積立・想定年利・目標額から、引退時点の想定資産や目標とのギャップ、達成に必要な積立額の目安を表示します。つみたてNISAや新NISAの口座そのものを操作するサービスではなく、ブラウザ上で動く概算ツールです。
          </p>
          <p>
            会員登録は不要で、入力値はサーバーに保存する目的では収集しません。結果は投資判断の根拠には使えません（
            <Link href="/disclaimer" className="text-emerald-700 hover:underline">
              免責事項
            </Link>
            ）。
          </p>
        </ContentSection>

        <ContentSection title="NISA制度との関係（ざっくり）">
          <p>
            2024年からの新しいNISAでは、つみたて投資枠・成長投資枠などの区分や非課税保有限度額が定められています。制度の詳細は金融庁の案内が正です。
          </p>
          <p>
            {SITE_NAME}
            は「口座の枠を使い切るシミュレーター」ではありません。どちらかというと、
            <span className="font-medium text-zinc-900">
              毎月いくら積み立て、何年・何％の仮定で、目標に届きそうか
            </span>
            を感覚的につかむためのツールです。年間投資上限や銘柄選定は、証券会社・公式案内で確認してください。
          </p>
          <p>
            <a
              href="https://www.fsa.go.jp/policy/nisa2/index.html"
              className="text-emerald-700 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              金融庁：NISA特設ページ
            </a>
          </p>
        </ContentSection>

        <ContentSection title="入力項目の意味">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-zinc-900">現在の年齢 / 引退したい年齢</span>
              — 差が「運用・積立を続ける年数」になります。短いほど同じ目標でも必要な積立が大きくなりがちです。
            </li>
            <li>
              <span className="font-medium text-zinc-900">現在の運用資産</span>
              — いま積み上がっている金額のスタート地点です。現金だけの予備資金と分けるかどうかは、自分のルールで決めて構いません。
            </li>
            <li>
              <span className="font-medium text-zinc-900">毎月の積立額</span>
              — 毎月追加で入れる想定額。増やすとギャップが縮む様子をすぐ確認できます。
            </li>
            <li>
              <span className="font-medium text-zinc-900">想定年利（%）</span>
              — 将来の利回りの仮定です。実際の相場は上下し、手数料や税金・為替も考慮していません。楽観と慎重の両方で試すと比較しやすいです。
            </li>
            <li>
              <span className="font-medium text-zinc-900">目標資産額</span>
              — 「引退時にこれくらいあれば」という自分用のゴールです。置き方は
              <Link
                href="/guides/retirement-funds"
                className="text-emerald-700 hover:underline"
              >
                老後資金ガイド
              </Link>
              も参照してください。
            </li>
          </ul>
        </ContentSection>

        <ContentSection title="結果の読み方">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-zinc-900">引退時の想定資産とギャップ</span>
              — 条件どおりに続けた場合の概算と、目標との差です。
            </li>
            <li>
              <span className="font-medium text-zinc-900">道のり（進捗）</span>
              — 「引退時の想定資産 ÷ 目標」で表示します。現在資産の達成率ではありません。
            </li>
            <li>
              <span className="font-medium text-zinc-900">達成に必要な毎月積立</span>
              — 同じ年数・利回りの仮定で、目標に届くために必要な積立の目安です。
            </li>
            <li>
              <span className="font-medium text-zinc-900">想定取り崩し（月・4%）</span>
              — 引退後に資産の年4%を取り崩す仮定での月額イメージです。詳細は
              <Link
                href="/guides/4-percent-rule"
                className="text-emerald-700 hover:underline"
              >
                4%ルールのガイド
              </Link>
              を参照してください。
            </li>
          </ul>
        </ContentSection>

        <ContentSection title="よくある誤解">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-zinc-900">表示額が「将来の確定額」だと思う</span>
              — あくまで仮定どおり進んだ場合の概算です。相場は変動します。
            </li>
            <li>
              <span className="font-medium text-zinc-900">進捗バーが「いまの資産の達成率」だと思う</span>
              — 引退時点の想定に対する進捗です。
            </li>
            <li>
              <span className="font-medium text-zinc-900">利回りを上げれば必ず目標に届く</span>
              — 高い利回りの仮定は結果を良く見せますが、そのリターンが得られる保証はありません。
            </li>
            <li>
              <span className="font-medium text-zinc-900">NISA口座の開設や銘柄選定までできる</span>
              — 当ツールは計算用です。口座・商品は各金融機関の案内をご確認ください。
            </li>
          </ul>
        </ContentSection>

        <GuideCta />

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
                href="/guides/4-percent-rule"
                className="text-emerald-700 hover:underline"
              >
                4%ルールとは？
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-emerald-700 hover:underline">
                FAQ・ヘルプ
              </Link>
            </li>
          </ul>
        </ContentSection>
      </ContentPage>
    </>
  );
}
