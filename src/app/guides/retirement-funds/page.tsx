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
  ogType: "article",
  publishedTime: guide.publishedAt,
  modifiedTime: guide.updatedAt,
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

        <ContentSection title="「○千万円」だけでは決められない理由">
          <p>
            いわゆる「老後2,000万円問題」は、金融庁の金融審議会・市場ワーキング・グループが示した
            <span className="font-medium text-zinc-900">特定の家計モデルでの試算例</span>
            として話題になりました。前提（夫婦世帯、支出水準、公的年金収入など）が変われば、不足額も変わります。
          </p>
          <p>
            したがって、見出しの金額をそのまま目標にするより、
            <span className="font-medium text-zinc-900">
              自分の「毎月の不足額 × 想定年数」
            </span>
            から逆算する方が、シミュレーターの「目標資産額」としても使いやすくなります。
          </p>
        </ContentSection>

        <ContentSection title="目安を置くときの3つの軸">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-zinc-900">毎月（または年間）の生活費</span>
              — 住居・食費・医療・趣味など、引退後に想定する支出のイメージ。総務省の家計調査などは「平均の参考」になりますが、自分の生活にはそのまま当てはまりません。
            </li>
            <li>
              <span className="font-medium text-zinc-900">何年分を見込むか</span>
              — 引退年齢から、厚生労働省の簡易生命表などで示される平均余命だけでなく、余裕を見た年数で考える人もいます。
            </li>
            <li>
              <span className="font-medium text-zinc-900">公的年金など別途入る収入</span>
              — 不足分だけを自前の資産でまかなう、という置き方も一般的です。年金額の目安は日本年金機構の案内やねんきん定期便などで確認できます。
            </li>
          </ul>
          <p>
            ざっくりした一例として、「毎月の不足が10万円・30年見込む」なら、単純計算で約3,600万円分のストックが候補になります。実際には運用の継続や取り崩し方で必要額の見え方は変わるため、あくまで出発点です。
          </p>
        </ContentSection>

        <ContentSection title="目標額の置き方（シンプルな手順）">
          <ol className="list-decimal space-y-2 pl-5">
            <li>引退後の月の支出イメージを置く（今より下がる/変わらない/上がる想定）。</li>
            <li>公的年金など、毎月入ると見込む収入を引く（＝毎月の不足額）。</li>
            <li>不足額 × 想定月数（または年数）で、まず総額のたたき台を作る。</li>
            <li>
              たたき台をシミュレーターの「目標資産額」に入れ、積立・利回り・引退年齢を動かしてギャップを見る。
            </li>
            <li>
              医療・介護・住宅修繕など不確実な支出は、最初から完璧に積み上げず、余裕枠として目標を少し厚くする、でも構いません。
            </li>
          </ol>
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

        <ContentSection title="参考になる公的情報（外部）">
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
              — 制度の枠組みの確認用。
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
              — 公的年金の仕組み・手続きの入口。
            </li>
            <li>
              <a
                href="https://www.stat.go.jp/data/kakei/"
                className="text-emerald-700 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                総務省統計局：家計調査
              </a>
              — 平均的な家計支出の参考データ。
            </li>
            <li>
              <a
                href="https://www.mhlw.go.jp/toukei/list/20-9.html"
                className="text-emerald-700 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                厚生労働省：簡易生命表
              </a>
              — 平均余命など寿命の統計。
            </li>
          </ul>
          <p className="text-sm text-zinc-600">
            外部サイトの内容・数値は更新されることがあります。最終確認は各公式ページで行ってください。当サイトはこれら機関の見解を代弁するものではありません。
          </p>
        </ContentSection>

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
