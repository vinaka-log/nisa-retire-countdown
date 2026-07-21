import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { GuideCta } from "@/components/GuideCta";
import { GuideJsonLd } from "@/components/GuideJsonLd";
import { getGuide } from "@/lib/guides";
import { pageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site";

const guide = getGuide("assumed-return")!;

export const metadata = pageMetadata({
  title: guide.title,
  description: guide.description,
  path: `/guides/${guide.slug}`,
  ogType: "article",
  publishedTime: guide.publishedAt,
  modifiedTime: guide.updatedAt,
});

export default function AssumedReturnGuidePage() {
  return (
    <>
      <GuideJsonLd guide={guide} />
      <ContentPage title={guide.title} description={guide.description}>
        <ContentSection title="結論：正解の％はなく、幅で読む">
          <p>
            積立シミュレーションの想定年利に正解はありません。過去の市場平均は参考のひとつに過ぎず、将来を保証しません。
            {SITE_NAME}
            でも特定の％を推奨しません。おすすめは、
            <span className="font-medium text-zinc-900">
              慎重側と中間（必要なら楽観側）を並べて、ギャップと必要積立の「幅」を見る
            </span>
            使い方です。
          </p>
          <p>
            投資助言ではありません。詳細は
            <Link href="/disclaimer" className="text-emerald-700 hover:underline">
              免責事項
            </Link>
            をご確認ください。
          </p>
        </ContentSection>

        <ContentSection title="3%・5%・7%の読み比べ（イメージ）">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-zinc-900">慎重側（例: 3%）</span>
              — ギャップが大きく・必要積立も大きく出やすいです。「足りない場合の下限イメージ」に使えます。
            </li>
            <li>
              <span className="font-medium text-zinc-900">中間（例: 5%）</span>
              — 比較の基準として置く人が多い仮定のひとつです。これだけ見て決めない方がよいです。
            </li>
            <li>
              <span className="font-medium text-zinc-900">楽観側（例: 7%）</span>
              — 結果は良く見えますが、そのリターンが続く前提ではありません。楽観だけで積立を減らすのは避けた方がよいです。
            </li>
          </ul>
          <p>
            数字は説明用の例です。あなたの運用商品や期間に当てはまるとは限りません。手数料・税金・為替・インフレも、この単純な％には通常含まれません。
          </p>
        </ContentSection>

        <ContentSection title="なぜ「高い利回り」に振り切ると危険か">
          <p>
            利回りを上げると、同じ積立でも引退時の想定資産は大きく増え、ギャップが消えて見えます。見た目が良くなるだけで、
            <span className="font-medium text-zinc-900">
              その％で運用できる保証にはなりません
            </span>
            。特に残年数が短いときに高利回りで帳尻を合わせようとすると、前提が崩れたときの落差が大きくなりがちです。
          </p>
          <p>
            ギャップが大きいときは、利回りを上げる前に、積立・目標・引退年齢のどれを動かすかを先に検討する方が安全なことが多いです。毎月額の考え方は
            <Link
              href="/guides/monthly-contribution"
              className="text-emerald-700 hover:underline"
            >
              毎月いくらが目安か
            </Link>
            を参照してください。
          </p>
        </ContentSection>

        <ContentSection title="シミュレーターでの試し方">
          <ol className="list-decimal space-y-2 pl-5">
            <li>年齢・資産・積立・目標を固定する。</li>
            <li>想定年利だけを 3% → 5% → 7% と切り替える。</li>
            <li>ギャップと「達成に必要な毎月積立」の差（幅）をメモする。</li>
            <li>
              家計で続けられる積立が、慎重側の必要額に近いか・中間なら届きそうか、を見る。
            </li>
          </ol>
          <p>
            入力項目全体の意味は
            <Link
              href="/guides/nisa-simulation"
              className="text-emerald-700 hover:underline"
            >
              シミュレーションの見方
            </Link>
            もどうぞ。
          </p>
        </ContentSection>

        <ContentSection title="よくある誤解">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-zinc-900">
                「過去平均＝将来の確定利回り」
              </span>
              — 過去は将来を保証しません。
            </li>
            <li>
              <span className="font-medium text-zinc-900">
                「表示額は手数料・税金込み」
              </span>
              — 当ツールは単純化した概算です。
            </li>
            <li>
              <span className="font-medium text-zinc-900">
                「高い％を選べば目標達成が確定」
              </span>
              — 仮定を変えただけです。
            </li>
          </ul>
        </ContentSection>

        <GuideCta note="想定年利だけ切り替えて、ギャップの幅を比べてみてください。" />

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
                href="/guides/monthly-contribution"
                className="text-emerald-700 hover:underline"
              >
                つみたてNISA 毎月いくらが目安か
              </Link>
            </li>
            <li>
              <Link
                href="/guides/4-percent-rule"
                className="text-emerald-700 hover:underline"
              >
                4%ルールと取り崩しシミュレーション
              </Link>
            </li>
          </ul>
        </ContentSection>
      </ContentPage>
    </>
  );
}
