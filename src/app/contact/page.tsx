import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import {
  getContactEmail,
  getGithubIssuesUrl,
  isContactEmailConfigured,
  SITE_NAME,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: `${SITE_NAME}へのお問い合わせ方法です。ご質問・ご意見はフォームまたはメールにて受け付けています。`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const contactEmail = getContactEmail();
  const emailConfigured = isContactEmailConfigured();
  const issuesUrl = getGithubIssuesUrl();

  return (
    <ContentPage
      title="お問い合わせ"
      description={`${SITE_NAME}に関するご質問・ご意見・不具合のご報告は、以下の方法でご連絡ください。`}
    >
      <ContentSection title="お問い合わせ方法">
        {emailConfigured ? (
          <p>
            お問い合わせ先メール:{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="font-medium text-emerald-700 underline-offset-2 hover:underline"
            >
              {contactEmail}
            </a>
          </p>
        ) : (
          <p>
            下記フォームからお問い合わせ内容を送信できます。送信後、GitHub
            Issues の新規作成画面が開き、内容を投稿いただけます。よくある質問は{" "}
            <Link href="/faq" className="text-emerald-700 hover:underline">
              FAQ・ヘルプ
            </Link>{" "}
            もご参照ください。
          </p>
        )}
        {!emailConfigured ? (
          <p className="text-sm text-zinc-600">
            Issues 一覧:{" "}
            <a
              href={issuesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-emerald-700 underline-offset-2 hover:underline"
            >
              {issuesUrl}
            </a>
          </p>
        ) : null}
      </ContentSection>

      <ContentSection title="お問い合わせフォーム">
        <p className="mb-4">
          {emailConfigured
            ? "下記フォームに内容を入力し、「メールで送信する」を押すと、ご利用端末のメールアプリが開きます。"
            : "下記フォームに内容を入力し、「問い合わせを送信する」を押すと、GitHub Issues の新規作成画面が開きます。"}
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
