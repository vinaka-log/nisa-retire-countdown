import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { FAQS } from "@/lib/faqs";
import { pageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site";

export const metadata = pageMetadata({
  title: "FAQ・ヘルプ",
  description: `${SITE_NAME}のよくある質問とヘルプ。シミュレーションの使い方や注意点をまとめています。`,
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
        <div className="space-y-4">
          {FAQS.map((item) => (
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
