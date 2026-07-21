import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { GuideCta } from "@/components/GuideCta";
import { GuideJsonLd } from "@/components/GuideJsonLd";
import { getGuide } from "@/lib/guides";
import { pageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site";

const guide = getGuide("rogo-2000man")!;

export const metadata = pageMetadata({
  title: guide.title,
  description: guide.description,
  path: `/guides/${guide.slug}`,
  ogType: "article",
  publishedTime: guide.publishedAt,
  modifiedTime: guide.updatedAt,
});

export default function Rogo2000manGuidePage() {
  return (
    <>
      <GuideJsonLd guide={guide} />
      <ContentPage title={guide.title} description={guide.description}>
        <ContentSection title="結論：2000万円は「見出し」であって目標の正解ではない">
          <p>
            「老後2000万円問題」は、特定の家計モデルでの試算例が話題になったものです。万人に共通する必要額ではありません。まずは
            <span className="font-medium text-zinc-900">
              自分の毎月の不足額 × 想定年数
            </span>
            でたたき台を作り、必要なら2000万円を比較用の目安として置きます。
          </p>
          <p>
            当サイトの情報は学習・検討の補助であり、投資助言や特定商品の推奨ではありません。詳細は
            <Link href="/disclaimer" className="text-emerald-700 hover:underline">
              免責事項
            </Link>
            をご確認ください。
          </p>
        </ContentSection>

        <ContentSection title="2000万円問題とは何だったか">
          <p>
            金融庁の金融審議会・市場ワーキング・グループが示した試算例では、ある夫婦世帯のモデルで、公的年金だけでは毎月の生活費に足りない分が積み上がる、というイメージが示されました。前提（支出水準・年金収入・年数など）が変われば、不足総額も変わります。
          </p>
          <p>
            したがって「必ず2000万円必要」「2000万円あれば十分」といった一律の結論にはなりません。見出しの数字をそのまま目標にするより、自分の不足から逆算する方が実用的です。考え方の詳細は
            <Link
              href="/guides/retirement-funds"
              className="text-emerald-700 hover:underline"
            >
              老後資金ガイド
            </Link>
            も参照してください。
          </p>
        </ContentSection>

        <ContentSection title="自分の不足額への置き換え方">
          <ol className="list-decimal space-y-2 pl-5">
            <li>引退後の月の支出イメージを置く。</li>
            <li>公的年金など、毎月入ると見込む収入を引く（＝毎月の不足）。</li>
            <li>不足額 × 想定月数で、総額のたたき台を作る。</li>
            <li>
              たたき台をシミュレーターの「目標資産額」に入れる（2000万円と比較してもよい）。
            </li>
          </ol>
          <p>
            例：不足8万円 × 30年 ≒ 約2,880万円。この場合、2000万円だけでは足りない可能性が高い、という読み方になります。逆に不足が小さい家計では、2000万円より低い目標でも足りる場合があります。
          </p>
        </ContentSection>

        <ContentSection title="NISA積立で「近づける」ときの見方">
          <p>
            新NISAのつみたて投資枠などは、非課税で長期積立しやすい制度のひとつです。ただし
            <span className="font-medium text-zinc-900">
              「NISAなら必ず2000万円に届く」わけではありません
            </span>
            。届くかどうかは、毎月の積立・年数・想定利回り・すでに持っている資産に依存します。
          </p>
          <p>
            {SITE_NAME}
            では、目標を2000万円（または自分のたたき台）に置き、積立と利回りを動かしてギャップを確認できます。枠の制度そのものは
            <Link
              href="/guides/new-nisa-basics"
              className="text-emerald-700 hover:underline"
            >
              新NISAの枠の基本
            </Link>
            、毎月いくらにするかは
            <Link
              href="/guides/monthly-contribution"
              className="text-emerald-700 hover:underline"
            >
              毎月いくらが目安か
            </Link>
            をどうぞ。
          </p>
        </ContentSection>

        <ContentSection title="シミュレーターでの試し方">
          <ol className="list-decimal space-y-2 pl-5">
            <li>目標資産額に「2000万円」または自分のたたき台を入れる。</li>
            <li>現在の年齢・引退年齢・現在資産・毎月積立・想定年利を入れる。</li>
            <li>ギャップと「達成に必要な毎月積立」を見る。</li>
            <li>
              積立を増やす・引退年齢をずらす・目標を見直す、の3つを比較する。
            </li>
          </ol>
          <p>
            利回りを上げて無理にギャップを消すより、前提を複数パターンで幅を見る方が安全です。想定年利の置き方は
            <Link
              href="/guides/assumed-return"
              className="text-emerald-700 hover:underline"
            >
              想定年利ガイド
            </Link>
            を参照してください。
          </p>
        </ContentSection>

        <GuideCta note="目標を2000万円にして、積立と年数を動かすとギャップの変化がすぐわかります。" />

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
                href="https://www.nenkin.go.jp/"
                className="text-emerald-700 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                日本年金機構
              </a>
            </li>
          </ul>
        </ContentSection>

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
