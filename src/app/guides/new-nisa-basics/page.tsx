import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { GuideCta } from "@/components/GuideCta";
import { GuideJsonLd } from "@/components/GuideJsonLd";
import { getGuide } from "@/lib/guides";
import { pageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site";

const guide = getGuide("new-nisa-basics")!;

export const metadata = pageMetadata({
  title: guide.title,
  description: guide.description,
  path: `/guides/${guide.slug}`,
  ogType: "article",
  publishedTime: guide.publishedAt,
  modifiedTime: guide.updatedAt,
});

export default function NewNisaBasicsGuidePage() {
  return (
    <>
      <GuideJsonLd guide={guide} />
      <ContentPage title={guide.title} description={guide.description}>
        <ContentSection title="結論：枠の理解は「上限」まで。目標達成は別計算">
          <p>
            新NISAには、つみたて投資枠・成長投資枠などの区分と、年間・生涯の非課税の上限があります。制度の詳細は金融庁の案内が正です。一方、
            <span className="font-medium text-zinc-900">
              老後の目標に届くかどうかは、枠の満額とは別問題
            </span>
            です。毎月いくら・何年・何％の仮定で届きそうかは、シミュレーションで確認します。
          </p>
          <p>
            当サイトは投資助言ではありません。詳細は
            <Link href="/disclaimer" className="text-emerald-700 hover:underline">
              免責事項
            </Link>
            をご確認ください。
          </p>
        </ContentSection>

        <ContentSection title="つみたて投資枠と成長投資枠（ざっくり）">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-zinc-900">つみたて投資枠</span>
              — 長期・積立・分散に向くとされる投資信託などが対象の枠。年間の投資上限があります。
            </li>
            <li>
              <span className="font-medium text-zinc-900">成長投資枠</span>
              — 上場株式や投資信託など、対象がより広い枠。こちらにも年間上限があります。
            </li>
            <li>
              <span className="font-medium text-zinc-900">生涯の非課税保有限度</span>
              — 枠をまたいだ合計の上限があります。売却後の枠の扱いなど、細部は公式案内で確認してください。
            </li>
          </ul>
          <p>
            数値や条件は改定されることがあります。最新は必ず公式で確認してください。
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

        <ContentSection title={`${SITE_NAME}との関係`}>
          <p>
            {SITE_NAME}
            は「口座の枠を使い切るシミュレーター」ではありません。どちらかというと、
            <span className="font-medium text-zinc-900">
              毎月の積立・年数・想定利回り・目標額から、引退までのギャップをつかむ
            </span>
            ための概算ツールです。年間上限や銘柄・商品選定は、証券会社・公式案内で確認してください。
          </p>
          <p>
            入力の意味は
            <Link
              href="/guides/nisa-simulation"
              className="text-emerald-700 hover:underline"
            >
              シミュレーションの見方
            </Link>
            、毎月額の考え方は
            <Link
              href="/guides/monthly-contribution"
              className="text-emerald-700 hover:underline"
            >
              毎月いくらが目安か
            </Link>
            を参照してください。
          </p>
        </ContentSection>

        <ContentSection title="枠を満額にする必要があるか">
          <p>
            上限まで使うことが目的ではありません。家計の余裕・生活防衛資金・他の優先支出とのバランスを見たうえで、続けられる額を置く方が現実的なことが多いです。満額にできない＝失敗、でもありません。
          </p>
          <p>
            老後目標との距離感は、2000万円などの見出し金額ではなく、自分の不足から置くと使いやすいです（
            <Link
              href="/guides/rogo-2000man"
              className="text-emerald-700 hover:underline"
            >
              老後2000万円問題ガイド
            </Link>
            ）。
          </p>
        </ContentSection>

        <ContentSection title="iDeCoとの違い（入口）">
          <p>
            NISAは用途の自由度が高く、iDeCoは原則として老後まで引き出しにくい代わりに所得控除などの特徴があります。どちらが「正解」かではなく、用途の切り分けです。詳しくは
            <Link
              href="/guides/nisa-vs-ideco"
              className="text-emerald-700 hover:underline"
            >
              NISAとiDeCoの違い
            </Link>
            をどうぞ。
          </p>
        </ContentSection>

        <GuideCta note="枠の上限とは別に、目標までのギャップをシミュレーターで確認できます。" />

        <ContentSection title="関連ガイド">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <Link
                href="/guides/nisa-vs-ideco"
                className="text-emerald-700 hover:underline"
              >
                NISAとiDeCoの違い
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
