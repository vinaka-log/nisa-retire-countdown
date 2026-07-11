import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import {
  getContactEmail,
  getOperatorAddress,
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

      <ContentSection title="サービス情報">
        <div className="content-info-list">
          <dl>
            <div className="content-info-row">
              <dt>サービス名</dt>
              <dd className="font-semibold text-zinc-900">{SITE_NAME}</dd>
            </div>
            <div className="content-info-row">
              <dt>所在地</dt>
              <dd
                className={
                  showAddress
                    ? "font-semibold text-zinc-900"
                    : "font-medium text-zinc-500"
                }
              >
                {showAddress
                  ? operatorAddress
                  : "オンライン提供のため、掲載なし"}
              </dd>
            </div>
            <div className="content-info-row">
              <dt>お問い合わせ</dt>
              <dd className="font-semibold text-zinc-900">
                {emailConfigured ? (
                  <>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="break-all font-medium text-emerald-700 underline-offset-2 hover:underline"
                    >
                      {contactEmail}
                    </a>
                    <span className="mt-1 block text-sm font-normal text-zinc-600">
                      または{" "}
                      <Link
                        href="/contact"
                        className="text-emerald-700 underline-offset-2 hover:underline"
                      >
                        お問い合わせフォーム
                      </Link>
                    </span>
                  </>
                ) : (
                  <>
                    <Link
                      href="/contact"
                      className="font-medium text-emerald-700 underline-offset-2 hover:underline"
                    >
                      お問い合わせページ
                    </Link>
                    <span className="mt-1 block text-sm font-normal text-zinc-600">
                      メールでのお問い合わせ受付を準備しています。
                    </span>
                  </>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </ContentSection>

      <ContentSection title="関連ページ">
        <nav aria-label="関連ページ" className="content-related">
          <Link
            href="/contact"
            className="text-emerald-700 underline-offset-2 hover:underline"
          >
            お問い合わせ
          </Link>
          <Link
            href="/privacy"
            className="text-emerald-700 underline-offset-2 hover:underline"
          >
            プライバシーポリシー
          </Link>
          <Link
            href="/terms"
            className="text-emerald-700 underline-offset-2 hover:underline"
          >
            利用規約
          </Link>
          <Link
            href="/disclaimer"
            className="text-emerald-700 underline-offset-2 hover:underline"
          >
            免責事項
          </Link>
        </nav>
      </ContentSection>
    </ContentPage>
  );
}
