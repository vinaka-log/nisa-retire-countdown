import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { GUIDES } from "@/lib/guides";
import { pageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site";

export const metadata = pageMetadata({
  title: "ガイド",
  description: `${SITE_NAME}のガイド一覧。老後資金・2000万円問題、毎月の積立目安、新NISA、想定年利、NISAとiDeCo、4%ルールなどを解説します。`,
  path: "/guides",
});

export default function GuidesIndexPage() {
  return (
    <ContentPage
      title="ガイド"
      description="老後資金やNISAの考え方、シミュレーションの読み方を、投資助言にならない範囲でわかりやすくまとめています。"
    >
      <ContentSection title="記事一覧">
        <ul className="space-y-3.5">
          {GUIDES.map((guide) => (
            <li key={guide.slug}>
              <Link href={`/guides/${guide.slug}`} className="content-card">
                <span className="content-card-title">{guide.title}</span>
                <span className="content-card-desc">{guide.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection title="シミュレーター">
        <p>
          条件を入力して、引退までのギャップをすぐ確認できます。{" "}
          <Link href="/" className="text-emerald-700 hover:underline">
            {SITE_NAME}を開く
          </Link>
        </p>
      </ContentSection>
    </ContentPage>
  );
}
