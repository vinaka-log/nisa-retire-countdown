import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { GuideCta } from "@/components/GuideCta";
import { SoftAffiliateCta } from "@/components/SoftAffiliateCta";
import { GuideJsonLd } from "@/components/GuideJsonLd";
import { getGuide } from "@/lib/guides";
import { pageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site";

const guide = getGuide("nisa-vs-ideco")!;

export const metadata = pageMetadata({
  title: guide.title,
  description: guide.description,
  path: `/guides/${guide.slug}`,
  ogType: "article",
  publishedTime: guide.publishedAt,
  modifiedTime: guide.updatedAt,
});

export default function NisaVsIdecoGuidePage() {
  return (
    <>
      <GuideJsonLd guide={guide} />
      <ContentPage title={guide.title} description={guide.description}>
        <ContentSection title="結論：どっちが正解ではなく、用途で切り分ける">
          <p>
            NISAとiDeCoは、どちらも資産形成の制度として比較されやすいですが、目的・引き出し・税制の効き方が違います。「どちらか一方が絶対に得」ではなく、
            <span className="font-medium text-zinc-900">
              老後専用でロックしてよいか、途中で使う可能性があるか
            </span>
            から考えると整理しやすいです。
          </p>
          <p>
            当サイトは投資助言や口座開設の勧誘ではありません。制度の詳細は各公式案内が正です。免責は
            <Link href="/disclaimer" className="text-emerald-700 hover:underline">
              こちら
            </Link>
            。
          </p>
        </ContentSection>

        <ContentSection title="違いの見取り図（学習用）">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-zinc-900">NISA</span>
              — 運用益が非課税になる枠。引き出しの自由度は比較的高いです。つみたて／成長などの区分があります（
              <Link
                href="/guides/new-nisa-basics"
                className="text-emerald-700 hover:underline"
              >
                新NISAの枠の基本
              </Link>
              ）。
            </li>
            <li>
              <span className="font-medium text-zinc-900">iDeCo</span>
              — 個人型確定拠出年金。掛金の所得控除など税制上の特徴がある一方、原則として老齢給付まで引き出しにくいです。
            </li>
            <li>
              <span className="font-medium text-zinc-900">共通して注意</span>
              — いずれも元本保証ではなく、商品・手数料・加入条件で見え方が変わります。
            </li>
          </ul>
          <p>
            最新の条件・上限・手続きは、金融庁・厚生労働省・国民年金基金連合会などの公式情報、および取扱機関の案内で確認してください。
          </p>
        </ContentSection>

        <ContentSection title="用途の切り分け（考え方の例）">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-zinc-900">
                60歳前後まで触らなくてよい老後資金
              </span>
              — iDeCoの「引き出せない」制約が、かえって継続の仕組みになることもあります（人による）。
            </li>
            <li>
              <span className="font-medium text-zinc-900">
                教育費・住宅・転職など、途中で使う可能性があるお金
              </span>
              — 引き出しやすい制度側に置く、という整理の仕方もあります。
            </li>
            <li>
              <span className="font-medium text-zinc-900">両方使う</span>
              — 余裕があれば併用する、という話もよくあります。家計の積立総額の上限は「続けられる額」です。
            </li>
          </ul>
          <p>
            個別の最適解は、所得・勤務先制度・年齢・支出予定で変わります。当サイトでは「どちらを開設すべきか」は扱いません。
          </p>
        </ContentSection>

        <ContentSection title="老後目標とのつなぎ方">
          <p>
            制度の選び方とは別に、引退時にいくら必要そうか、今の積立ペースでギャップはどれくらいか、は数字で確認できます。目標の置き方は
            <Link
              href="/guides/retirement-funds"
              className="text-emerald-700 hover:underline"
            >
              老後資金ガイド
            </Link>
            、取り崩しの月額イメージは
            <Link
              href="/guides/4-percent-rule"
              className="text-emerald-700 hover:underline"
            >
              4%ルールガイド
            </Link>
            を参照してください。
          </p>
          <p>
            {SITE_NAME}
            はNISA／iDeCoの口座残高を自動連携するサービスではありません。手元の積立額・資産額を手入力して、概算のギャップを見る用途です。
          </p>
        </ContentSection>

        <ContentSection title="参考（外部）">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <a
                href="https://www.fsa.go.jp/policy/nisa2/index.html"
                className="text-emerald-700 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                金融庁：NISA特設ページ
              </a>
            </li>
            <li>
              <a
                href="https://www.ideco-koushiki.jp/"
                className="text-emerald-700 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                iDeCo公式サイト
              </a>
            </li>
          </ul>
        </ContentSection>

        <SoftAffiliateCta placement="guide" />

        <GuideCta note="制度の選択と別に、目標までのギャップをシミュレーターで確認できます。" />

        <ContentSection title="関連ガイド">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <Link
                href="/guides/new-nisa-basics"
                className="text-emerald-700 hover:underline"
              >
                新NISAの枠の基本
              </Link>
            </li>
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
                href="/guides/monthly-contribution"
                className="text-emerald-700 hover:underline"
              >
                つみたてNISA 毎月いくらが目安か
              </Link>
            </li>
          </ul>
        </ContentSection>
      </ContentPage>
    </>
  );
}
