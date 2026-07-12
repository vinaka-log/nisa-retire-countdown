import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { pageMetadata } from "@/lib/page-metadata";
import {
  getContactEmailDisplay,
  isContactEmailConfigured,
  SITE_NAME,
} from "@/lib/site";

export const metadata = pageMetadata({
  title: "利用規約",
  description: `${SITE_NAME}のご利用条件（利用規約）です。`,
  path: "/terms",
});

export default function TermsPage() {
  const contactEmail = getContactEmailDisplay();
  const emailConfigured = isContactEmailConfigured();

  return (
    <ContentPage
      title="利用規約"
      description={`${SITE_NAME}（以下「当サイト」）をご利用いただく前に、本規約をお読みください。ご利用をもって本規約に同意したものとみなします。`}
    >
      <ContentSection title="1. サービスの内容">
        <p>
          当サイトは、つみたてNISA等を想定した積立シミュレーションを無料で提供する情報提供サイトです。金融商品取引法上の投資助言・代理業その他の許認可に基づくサービスではありません。
        </p>
      </ContentSection>

      <ContentSection title="2. 禁止事項">
        <p>利用者は、以下の行為を行ってはなりません。</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>法令または公序良俗に反する行為</li>
          <li>当サイトの運営を妨害する行為、不正アクセス、過度な負荷をかける行為</li>
          <li>当サイトのコンテンツの無断での商用転載・改変・再配布（法令で認められる場合を除く）</li>
          <li>他者の権利を侵害する行為</li>
        </ul>
      </ContentSection>

      <ContentSection title="3. シミュレーション結果について">
        <p>
          表示される数値・年数・進捗等は概算の目安であり、将来の成果を保証するものではありません。投資・資産形成に関する最終判断は、利用者ご自身の責任で行ってください。詳細は
          <Link href="/disclaimer" className="text-emerald-700 hover:underline">
            免責事項
          </Link>
          をご確認ください。
        </p>
      </ContentSection>

      <ContentSection title="4. アフィリエイト広告">
        <p>
          当サイトには、アフィリエイト広告（第三者の商品・サービスの紹介）が含まれる場合があります。リンク先での契約・申込は利用者と当該事業者との間で行われ、当サイトは取引の当事者ではありません。
        </p>
      </ContentSection>

      <ContentSection title="5. 知的財産権">
        <p>
          当サイトに掲載される文章・デザイン・プログラム・画像等の権利は、運営者または正当な権利者に帰属します。私的利用の範囲を超える複製・転載等はご遠慮ください。
        </p>
      </ContentSection>

      <ContentSection title="6. サービスの変更・中断・終了">
        <p>
          運営者は、事前の通知なくサービスの内容変更、一時停止、または終了を行うことがあります。これによって生じた損害について、運営者は法令上許容される範囲で責任を負いません。
        </p>
      </ContentSection>

      <ContentSection title="7. 免責">
        <p>
          当サイトの利用、または利用できないことによって生じた損害について、運営者は故意または重過失がある場合を除き、責任を負いません。詳細は
          <Link href="/disclaimer" className="text-emerald-700 hover:underline">
            免責事項
          </Link>
          をあわせてご確認ください。
        </p>
      </ContentSection>

      <ContentSection title="8. 規約の変更">
        <p>
          本規約は必要に応じて変更することがあります。変更後の規約は、当サイトに掲載した時点から効力を生じるものとします。
        </p>
      </ContentSection>

      <ContentSection title="9. 準拠法・管轄">
        <p>
          本規約は日本法に準拠します。当サイトに関して紛争が生じた場合、運営者の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします（所在地が未公開の場合は、合理的な管轄裁判所とします）。
        </p>
      </ContentSection>

      <ContentSection title="10. お問い合わせ">
        <p>
          本規約に関するお問い合わせは、
          <Link href="/contact" className="text-emerald-700 hover:underline">
            お問い合わせページ
          </Link>
          {emailConfigured ? `、または ${contactEmail}` : ""}
          までご連絡ください。
        </p>
      </ContentSection>

      <p className="text-xs text-zinc-500">制定日: 2026年7月11日</p>
    </ContentPage>
  );
}
