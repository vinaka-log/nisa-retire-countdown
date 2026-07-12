import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { pageMetadata } from "@/lib/page-metadata";
import {
  getContactEmail,
  isContactEmailConfigured,
  SITE_NAME,
} from "@/lib/site";

export const metadata = pageMetadata({
  title: "お問い合わせ",
  description: `${SITE_NAME}へのお問い合わせ方法です。ご質問・ご意見はメールにて受け付けています。`,
  path: "/contact",
});

export default function ContactPage() {
  const contactEmail = getContactEmail();
  const emailConfigured = isContactEmailConfigured();

  return (
    <ContentPage
      title="お問い合わせ"
      description={`${SITE_NAME}に関するご質問・ご意見・不具合のご報告は、メールでご連絡ください。`}
    >
      <ContentSection title="お問い合わせ方法">
        <p>メールで受付しています。</p>
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
            現在メールでのお問い合わせ受付を準備しています。しばらくしてから再度お試しください。よくある質問は{" "}
            <Link href="/faq" className="text-emerald-700 hover:underline">
              FAQ・ヘルプ
            </Link>{" "}
            もご参照ください。
          </p>
        )}
      </ContentSection>

      <ContentSection title="お問い合わせフォーム">
        <p className="mb-4">
          {emailConfigured
            ? "下記フォームに内容を入力し、「メールで送信する」を押すと、ご利用端末のメールアプリが開きます。"
            : "メール受付の準備が整い次第、フォームからお問い合わせいただけるようになります。"}
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
