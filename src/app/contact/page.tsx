import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import {
  getContactEmail,
  getContactEmailDisplay,
  isContactEmailConfigured,
  OPERATOR_PLACEHOLDER,
  SITE_NAME,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: `${SITE_NAME}へのお問い合わせ方法です。ご質問・ご意見はメールにて受け付けています。`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const contactEmail = getContactEmail();
  const displayEmail = getContactEmailDisplay();
  const emailConfigured = isContactEmailConfigured();

  return (
    <ContentPage
      title="お問い合わせ"
      description={`${SITE_NAME}に関するご質問・ご意見・不具合のご報告は、以下の方法でご連絡ください。`}
    >
      <ContentSection title="メールでのご連絡">
        <p>
          お問い合わせ先:{" "}
          {emailConfigured ? (
            <a
              href={`mailto:${contactEmail}`}
              className="font-medium text-emerald-700 underline-offset-2 hover:underline"
            >
              {displayEmail}
            </a>
          ) : (
            <span className="font-medium text-zinc-900">{displayEmail}</span>
          )}
        </p>
        {!emailConfigured ? (
          <p className="text-xs text-zinc-500">
            運営メールは公開時に{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs">
              NEXT_PUBLIC_CONTACT_EMAIL
            </code>{" "}
            （現在: {OPERATOR_PLACEHOLDER}）へ設定してください。
          </p>
        ) : null}
      </ContentSection>

      <ContentSection title="お問い合わせフォーム">
        <p className="mb-4">
          下記フォームに内容を入力し、「メールで送信する」を押すと、ご利用端末のメールアプリが開きます。
        </p>
        <ContactForm contactEmail={contactEmail} />
      </ContentSection>

      <ContentSection title="ご回答について">
        <ul className="list-disc space-y-1 pl-5">
          <li>内容により、回答までにお時間をいただく場合があります。</li>
          <li>投資判断・個別の資産運用に関する助言はお答えできません。</li>
          <li>
            プライバシーの取り扱いについては{" "}
            <Link href="/privacy" className="text-emerald-700 hover:underline">
              プライバシーポリシー
            </Link>{" "}
            をご確認ください。
          </li>
        </ul>
      </ContentSection>
    </ContentPage>
  );
}
