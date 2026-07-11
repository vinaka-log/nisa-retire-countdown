import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import {
  getContactEmail,
  getContactEmailDisplay,
  getOperatorAddress,
  getOperatorName,
  isContactEmailConfigured,
  OPERATOR_PLACEHOLDER,
  SITE_NAME,
  SITE_TITLE,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "運営者情報",
  description: `${SITE_NAME}の運営者情報・サイトの目的・お問い合わせ先のご案内です。`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const operatorName = getOperatorName();
  const operatorAddress = getOperatorAddress();
  const contactEmail = getContactEmail();
  const contactDisplay = getContactEmailDisplay();
  const emailConfigured = isContactEmailConfigured();

  return (
    <ContentPage
      title="運営者情報"
      description={`${SITE_NAME}の運営に関する情報です。アフィリエイト審査・利用者向けの透明性確保のため掲載しています。`}
    >
      <ContentSection title="サイトの目的">
        <p>
          「{SITE_TITLE}」をコンセプトに、つみたてNISA等の積立投資を想定した簡易シミュレーションを無料で提供しています。老後資金や引退までの年数の目安を確認できることを目的としており、投資助言や金融商品の勧誘を目的としたものではありません。
        </p>
      </ContentSection>

      <ContentSection title="運営者">
        <dl className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5">
          <div>
            <dt className="text-xs font-medium text-zinc-500">サービス名</dt>
            <dd className="mt-1 font-medium text-zinc-900">{SITE_NAME}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-zinc-500">運営者名</dt>
            <dd className="mt-1 font-medium text-zinc-900">{operatorName}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-zinc-500">所在地</dt>
            <dd className="mt-1 font-medium text-zinc-900">{operatorAddress}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-zinc-500">お問い合わせ</dt>
            <dd className="mt-1">
              {emailConfigured ? (
                <a
                  href={`mailto:${contactEmail}`}
                  className="font-medium text-emerald-700 underline-offset-2 hover:underline"
                >
                  {contactDisplay}
                </a>
              ) : (
                <span className="font-medium text-zinc-900">{contactDisplay}</span>
              )}
              <span className="mt-1 block text-zinc-600">
                または{" "}
                <Link
                  href="/contact"
                  className="text-emerald-700 underline-offset-2 hover:underline"
                >
                  お問い合わせフォーム
                </Link>
              </span>
            </dd>
          </div>
        </dl>
        {(operatorName === OPERATOR_PLACEHOLDER ||
          operatorAddress === OPERATOR_PLACEHOLDER ||
          !emailConfigured) && (
          <p className="mt-3 text-xs text-zinc-500">
            「{OPERATOR_PLACEHOLDER}」と表示されている項目は、公開前に環境変数（
            NEXT_PUBLIC_OPERATOR_NAME / NEXT_PUBLIC_OPERATOR_ADDRESS /
            NEXT_PUBLIC_CONTACT_EMAIL）へ実情報を設定してください。
          </p>
        )}
      </ContentSection>

      <ContentSection title="関連ページ">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <Link href="/contact" className="text-emerald-700 hover:underline">
              お問い合わせ
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="text-emerald-700 hover:underline">
              プライバシーポリシー
            </Link>
          </li>
          <li>
            <Link href="/disclaimer" className="text-emerald-700 hover:underline">
              免責事項
            </Link>
          </li>
        </ul>
      </ContentSection>
    </ContentPage>
  );
}
