import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import {
  getContactEmail,
  getOperatorAddress,
  getOperatorName,
  hasOperatorAddress,
  isContactEmailConfigured,
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
  const emailConfigured = isContactEmailConfigured();
  const showAddress = hasOperatorAddress();

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
          {showAddress ? (
            <div>
              <dt className="text-xs font-medium text-zinc-500">所在地</dt>
              <dd className="mt-1 font-medium text-zinc-900">
                {operatorAddress}
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="text-xs font-medium text-zinc-500">お問い合わせ</dt>
            <dd className="mt-1">
              {emailConfigured ? (
                <a
                  href={`mailto:${contactEmail}`}
                  className="font-medium text-emerald-700 underline-offset-2 hover:underline"
                >
                  {contactEmail}
                </a>
              ) : (
                <Link
                  href="/contact"
                  className="font-medium text-emerald-700 underline-offset-2 hover:underline"
                >
                  お問い合わせフォーム
                </Link>
              )}
              {emailConfigured ? (
                <span className="mt-1 block text-zinc-600">
                  または{" "}
                  <Link
                    href="/contact"
                    className="text-emerald-700 underline-offset-2 hover:underline"
                  >
                    お問い合わせフォーム
                  </Link>
                </span>
              ) : (
                <span className="mt-1 block text-sm text-zinc-600">
                  ご質問・ご意見はお問い合わせページからご連絡ください。
                </span>
              )}
            </dd>
          </div>
        </dl>
      </ContentSection>

      {!showAddress ? (
        <ContentSection title="所在地について">
          <p>
            当サイトはオンラインで提供する無料のシミュレーションサービスです。所在地の掲載が必要な場合は、運営者情報に追記します。お問い合わせは
            <Link
              href="/contact"
              className="mx-1 text-emerald-700 underline-offset-2 hover:underline"
            >
              お問い合わせページ
            </Link>
            をご利用ください。
          </p>
        </ContentSection>
      ) : null}

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
