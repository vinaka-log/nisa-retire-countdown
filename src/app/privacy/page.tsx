import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { pageMetadata } from "@/lib/page-metadata";
import {
  getContactEmailDisplay,
  isContactEmailConfigured,
  SITE_NAME,
} from "@/lib/site";

export const metadata = pageMetadata({
  title: "プライバシーポリシー",
  description: `${SITE_NAME}における個人情報・アクセス情報の取り扱いについて説明します。`,
  path: "/privacy",
});

export default function PrivacyPage() {
  const contactEmail = getContactEmailDisplay();
  const emailConfigured = isContactEmailConfigured();

  return (
    <ContentPage
      title="プライバシーポリシー"
      description={`${SITE_NAME}（以下「当サイト」）における、利用者情報の取り扱い方針です。`}
    >
      <ContentSection title="1. 基本方針">
        <p>
          当サイトは、利用者のプライバシーを尊重し、個人情報の保護に努めます。本ポリシーは、当サイトの利用に関する情報の取り扱いを定めたものです。
        </p>
      </ContentSection>

      <ContentSection title="2. 収集する情報">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-zinc-900">シミュレーション入力値:</span>{" "}
            年齢・資産額などの入力は、原則としてお使いの端末（ブラウザ）上でのみ処理され、運営者がサーバーに保存する目的では収集しません。
          </li>
          <li>
            <span className="font-medium text-zinc-900">お問い合わせ:</span>{" "}
            メールまたはメールアプリ経由でご連絡いただいた場合、氏名・メールアドレス・メッセージ内容など、ご記載の情報を問い合わせ対応のために利用します。
          </li>
          <li>
            <span className="font-medium text-zinc-900">アクセス解析:</span>{" "}
            当サイトでは、利用状況の把握のため Google Analytics 等の解析ツールを利用する場合があります。その場合、Cookie 等により匿名化された利用状況データが収集されることがあります。
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="3. 利用目的">
        <ul className="list-disc space-y-1 pl-5">
          <li>サービスの提供・改善・不具合対応</li>
          <li>お問い合わせへの回答</li>
          <li>利用状況の分析（解析ツールを導入している場合）</li>
          <li>不正利用の防止およびサイト運営上必要な連絡</li>
        </ul>
      </ContentSection>

      <ContentSection title="4. Cookie について">
        <p>
          アクセス解析や表示最適化のため、Cookie や類似技術を使用する場合があります。ブラウザ設定により Cookie を拒否できますが、一部機能に影響が出る可能性があります。
        </p>
      </ContentSection>

      <ContentSection title="5. 第三者への提供">
        <p>
          法令に基づく場合、または利用者の同意がある場合を除き、個人を特定できる情報を第三者に提供しません。解析ツール・ホスティング・メール等のサービス提供者に、サービス提供に必要な範囲でデータが処理されることがあります。
        </p>
      </ContentSection>

      <ContentSection title="6. アフィリエイトリンク">
        <p>
          当サイトにはアフィリエイト広告が含まれる場合があります。リンク先のサービスにおける個人情報の取り扱いは、各事業者のプライバシーポリシーに従います。
        </p>
      </ContentSection>

      <ContentSection title="7. 安全管理">
        <p>
          取得した情報の漏えい・滅失・毀損の防止のため、合理的な範囲で適切な管理に努めます。ただし、インターネット通信の性質上、完全な安全性を保証するものではありません。
        </p>
      </ContentSection>

      <ContentSection title="8. 開示・訂正・削除等">
        <p>
          お問い合わせにより取得したご自身の個人情報について、開示・訂正・削除等をご希望の場合は、下記連絡先までご連絡ください。本人確認のうえ、合理的な範囲で対応します。
        </p>
      </ContentSection>

      <ContentSection title="9. 改定">
        <p>
          本ポリシーの内容は、必要に応じて改定することがあります。重要な変更がある場合は、当サイト上でお知らせします。
        </p>
      </ContentSection>

      <ContentSection title="10. お問い合わせ">
        <p>
          本ポリシーに関するお問い合わせは、
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
