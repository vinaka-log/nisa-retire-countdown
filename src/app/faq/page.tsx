import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ・ヘルプ",
  description: `${SITE_NAME}のよくある質問とヘルプ。シミュレーションの使い方や注意点をまとめています。`,
  alternates: { canonical: "/faq" },
};

const faqs = [
  {
    q: "このサイトは何ができますか？",
    a: "現在の年齢・引退希望年齢・資産額・毎月の積立額・想定年利・目標金額をもとに、引退までの年数や想定資産の目安をシミュレーションできます。",
  },
  {
    q: "表示される金額は正確ですか？",
    a: "いいえ。複利や積立を単純化した概算です。手数料・税金・相場変動・入出金タイミングなどは考慮していません。投資判断の根拠としてはご利用いただけません。",
  },
  {
    q: "投資のアドバイスやおすすめ商品はありますか？",
    a: "ありません。当サイトは投資助言業者ではなく、特定の金融商品・証券会社・クレジットカードを推奨・勧誘するものではありません。",
  },
  {
    q: "「4%ルール」とは何ですか？",
    a: "引退後の資産取り崩しの一般的な仮定のひとつとして、資産の年4%程度を取り崩す考え方を簡易表示しています。個人の状況や相場により適切とは限りません。",
  },
  {
    q: "会員登録や個人情報の入力は必要ですか？",
    a: "シミュレーターの利用に会員登録は不要です。入力値はブラウザ上で計算に使われ、ログインや口座開設を求めるものではありません。",
  },
  {
    q: "広告やアフィリエイトリンクはありますか？",
    a: "当サイトはアフィリエイト広告を掲載する場合があります。リンク先での契約・取引は各サービス提供元との間で行われます。詳細は免責事項・プライバシーポリシーをご確認ください。",
  },
  {
    q: "不具合や質問がある場合は？",
    a: "お問い合わせページからメールでご連絡ください。内容によっては返信までお時間をいただく場合があります。",
  },
];

export default function FaqPage() {
  return (
    <ContentPage
      title="FAQ・ヘルプ"
      description={`${SITE_NAME}の使い方と、よくいただくご質問をまとめています。`}
    >
      <div className="space-y-4">
        {faqs.map((item) => (
          <section
            key={item.q}
            className="rounded-2xl border border-zinc-200 bg-white p-5"
          >
            <h2 className="text-base font-semibold text-zinc-900">{item.q}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 sm:text-base">
              {item.a}
            </p>
          </section>
        ))}
      </div>

      <ContentSection title="関連ページ">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <Link href="/disclaimer" className="text-emerald-700 hover:underline">
              免責事項
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-emerald-700 hover:underline">
              お問い合わせ
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-emerald-700 hover:underline">
              運営者情報
            </Link>
          </li>
        </ul>
      </ContentSection>
    </ContentPage>
  );
}
