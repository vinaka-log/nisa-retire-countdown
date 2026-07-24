import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { GuideCta } from "@/components/GuideCta";
import { GuideJsonLd } from "@/components/GuideJsonLd";
import { SoftAffiliateCta } from "@/components/SoftAffiliateCta";
import { getGuide } from "@/lib/guides";
import { pageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site";

const guide = getGuide("points-and-gap")!;

export const metadata = pageMetadata({
  title: guide.title,
  description: guide.description,
  path: `/guides/${guide.slug}`,
  ogType: "article",
  publishedTime: guide.publishedAt,
  modifiedTime: guide.updatedAt,
});

export default function PointsAndGapGuidePage() {
  return (
    <>
      <GuideJsonLd guide={guide} />
      <ContentPage title={guide.title} description={guide.description}>
        <ContentSection title="結論：ギャップを縮めるレバーは積立額だけではない">
          <p>
            引退までの不足（ギャップ）を縮めるとき、多くの人がまず「毎月の積立を増やす」を考えます。それは有効ですが、唯一の手段ではありません。
          </p>
          <p>
            もう一つの視点は、
            <span className="font-medium text-zinc-900">
              すでに発生している日常の支払いからポイントを取りこぼさず、その分を積立の余力につなげる
            </span>
            ことです。家計の総額を大きく変えなくても、「続く積立」を支えやすくなります。
          </p>
          <p>
            特定のカードや証券会社の推奨・勧誘ではありません。条件・還元率は各公式の案内を優先してください。詳細は
            <Link href="/disclaimer" className="text-emerald-700 hover:underline">
              免責事項
            </Link>
            をご確認ください。
          </p>
        </ContentSection>

        <ContentSection title="なぜ「ポイント」がギャップと関係するか">
          <p>
            {SITE_NAME}
            では、目標資産と現在のペースの差を「ギャップ」として示します。ギャップを縮める主なレバーは次のとおりです。
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>毎月の積立額を上げる</li>
            <li>目標額や引退年齢を見直す</li>
            <li>運用の想定を現実的な範囲で置く（利回りだけで帳尻を合わせない）</li>
          </ul>
          <p>
            ポイントは、このうち「毎月の積立額」を支える
            <span className="font-medium text-zinc-900">余力づくり</span>
            に効きます。還元を現金やポイントとして受け取れるなら、その一部を積立に回す選択肢が生まれます。少額でも、長く続けるとギャップへの効き方は無視しにくくなります。
          </p>
        </ContentSection>

        <ContentSection title="進め方の例（無理のない範囲で）">
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              まずシミュレーターで、いまの積立ペースでのギャップと「達成に必要な毎月積立」を確認する。
            </li>
            <li>
              必要額と、いま続けられている額の差を見る（
              <Link
                href="/guides/monthly-contribution"
                className="text-emerald-700 hover:underline"
              >
                毎月いくらが目安か
              </Link>
              ）。
            </li>
            <li>
              差を埋める手段として、支出の見直し・副収入・積立増額と並べて、「支払いポイントの取りこぼし」がないかも確認する。
            </li>
            <li>
              カードを選ぶ・申し込む場合は、年会費・還元条件・家計に合うかを公式情報で確認する。無理な申込は不要です。
            </li>
          </ol>
        </ContentSection>

        <ContentSection title="注意点（ここを外すと逆効果）">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-zinc-900">使いすぎない</span>
              — 還元目的で支出を増やすと、積立余力はむしろ減ります。
            </li>
            <li>
              <span className="font-medium text-zinc-900">条件は公式優先</span>
              — 還元率・対象店舗・年会費は変更され得ます。
            </li>
            <li>
              <span className="font-medium text-zinc-900">クレカ積立とは別物</span>
              — 証券会社の「クレジットカード積立」対応カードと、日常還元カードは目的が違います。混同しないでください。
            </li>
            <li>
              本サイトの紹介リンクがある場合は広告を含みます。契約は利用者と事業者の間で行われます。
            </li>
          </ul>
        </ContentSection>

        <SoftAffiliateCta placement="guide" />

        <GuideCta note="ギャップと必要積立を見たうえで、余力づくりの選択肢を比べてみてください。" />

        <ContentSection title="関連ガイド">
          <ul className="list-disc space-y-1 pl-5">
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
                href="/guides/retirement-funds"
                className="text-emerald-700 hover:underline"
              >
                老後資金はいくら必要？目安の考え方
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
          </ul>
        </ContentSection>
      </ContentPage>
    </>
  );
}
