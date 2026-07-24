import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { GuideCta } from "@/components/GuideCta";
import { GuideJsonLd } from "@/components/GuideJsonLd";
import { getGuide } from "@/lib/guides";
import { pageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site";

const guide = getGuide("monthly-contribution")!;

export const metadata = pageMetadata({
  title: guide.title,
  description: guide.description,
  path: `/guides/${guide.slug}`,
  ogType: "article",
  publishedTime: guide.publishedAt,
  modifiedTime: guide.updatedAt,
});

export default function MonthlyContributionGuidePage() {
  return (
    <>
      <GuideJsonLd guide={guide} />
      <ContentPage title={guide.title} description={guide.description}>
        <ContentSection title="結論：正解の月額はなく、目標から逆算する">
          <p>
            「つみたてNISAは毎月いくらがいいですか？」に一律の答えはありません。家計の余裕・目標額・残りの年数・想定利回りで必要額は変わります。おすすめは、
            <span className="font-medium text-zinc-900">
              まず目標を置き、必要な毎月積立の目安を見てから、続けられる額に落とす
            </span>
            流れです。
          </p>
          <p>
            投資助言や特定の積立額の推奨ではありません。詳細は
            <Link href="/disclaimer" className="text-emerald-700 hover:underline">
              免責事項
            </Link>
            をご確認ください。
          </p>
        </ContentSection>

        <ContentSection title="よくある「月○万円」の見方">
          <p>
            記事やSNSでは「月3万円」「月5万円」などの目安が並ぶことがあります。それらは特定の前提（開始年齢・利回り・目標2000万円など）での一例に過ぎません。前提が違うと比較になりません。
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-zinc-900">続けられるか</span>
              — 高すぎる額は途中で止まりやすいです。
            </li>
            <li>
              <span className="font-medium text-zinc-900">制度の上限</span>
              — 新NISAのつみたて投資枠には年間上限があります（詳細は金融庁案内）。上限いっぱいが必須ではありません。
            </li>
            <li>
              <span className="font-medium text-zinc-900">目標との関係</span>
              — 同じ月額でも、年数と利回りで引退時の想定は大きく変わります。
            </li>
          </ul>
        </ContentSection>

        <ContentSection title="目標から逆算する手順">
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              目標資産額のたたき台を置く（
              <Link
                href="/guides/retirement-funds"
                className="text-emerald-700 hover:underline"
              >
                老後資金ガイド
              </Link>
              ・
              <Link
                href="/guides/rogo-2000man"
                className="text-emerald-700 hover:underline"
              >
                2000万円問題ガイド
              </Link>
              ）。
            </li>
            <li>現在の年齢・引退したい年齢・現在の運用資産を入れる。</li>
            <li>想定年利を慎重側と中間で2パターン置く（
              <Link
                href="/guides/assumed-return"
                className="text-emerald-700 hover:underline"
              >
                想定年利ガイド
              </Link>
              ）。
            </li>
            <li>
              {SITE_NAME}
              の「達成に必要な毎月積立」を見る。
            </li>
            <li>
              必要額と家計の余裕を見比べ、続けられる額に調整する（足りなければ目標や引退年齢も見直す）。
            </li>
          </ol>
        </ContentSection>

        <ContentSection title="枠の上限と「無理に満額」について">
          <p>
            つみたて投資枠の年間上限は制度で決まっていますが、
            <span className="font-medium text-zinc-900">
              上限まで使うことが目的ではありません
            </span>
            。生活防衛資金や返済・教育費とのバランスを崩して満額にするより、続けられる額の方が長期では効きやすい、という考え方もあります。枠の区分は
            <Link
              href="/guides/new-nisa-basics"
              className="text-emerald-700 hover:underline"
            >
              新NISAの枠の基本
            </Link>
            を参照してください。
          </p>
        </ContentSection>

        <ContentSection title="シミュレーターでの試し方">
          <p>
            いまの積立額を入れたときのギャップと、必要積立の表示を並べて見ると、「あとどれくらい増やすと届きそうか」が感覚的につかめます。積立を1万円単位で動かして、ギャップの縮み方を比較する使い方が分かりやすいです。
          </p>
          <p>
            計算は複利と積立を単純化した概算で、手数料・税金・相場変動は含みません。入力項目の意味は
            <Link
              href="/guides/nisa-simulation"
              className="text-emerald-700 hover:underline"
            >
              シミュレーションの見方
            </Link>
            もどうぞ。
          </p>
        </ContentSection>

        <GuideCta note="毎月の積立を変えると、ギャップと道のりがリアルタイムで更新されます。" />

        <ContentSection title="関連ガイド">
          <ul className="list-disc space-y-1 pl-5">
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
                href="/guides/points-and-gap"
                className="text-emerald-700 hover:underline"
              >
                積立余力を増やす：日常のポイントとギャップ
              </Link>
            </li>
            <li>
              <Link
                href="/guides/assumed-return"
                className="text-emerald-700 hover:underline"
              >
                想定年利の置き方
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
