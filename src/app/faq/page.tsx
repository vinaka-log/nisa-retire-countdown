import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { FAQS } from "@/lib/faqs";
import { pageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site";

export const metadata = pageMetadata({
  title: "FAQ・ヘルプ",
  description: `${SITE_NAME}のよくある質問。シミュレーションの精度、老後資金の目標、4%ルールの取り崩し目安、想定年利の置き方などをまとめています。`,
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <FaqJsonLd faqs={FAQS} />
      <ContentPage
        title="FAQ・ヘルプ"
        description={`${SITE_NAME}の使い方と、よくいただくご質問をまとめています。`}
      >
        <div className="space-y-3.5">
          {FAQS.map((item) => (
            <section key={item.q} className="content-card">
              <h2 className="content-card-title">{item.q}</h2>
              <p className="content-card-desc mt-2">{item.a}</p>
            </section>
          ))}
        </div>

        <ContentSection title="関連ページ">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <Link
                href="/guides/4-percent-rule"
                className="text-emerald-700 hover:underline"
              >
                4%ルールと取り崩しシミュレーション
              </Link>
            </li>
            <li>
              <Link href="/guides" className="text-emerald-700 hover:underline">
                ガイド一覧
              </Link>
            </li>
            <li>
              <Link
                href="/disclaimer"
                className="text-emerald-700 hover:underline"
              >
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
    </>
  );
}
