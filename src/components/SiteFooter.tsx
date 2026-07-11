import Link from "next/link";
import { AffiliateLink } from "@/components/AffiliateLink";
import {
  AFFILIATE_DISCLOSURE,
  getConfiguredAffiliatePartners,
  hasConfiguredAffiliatePartners,
  SIMULATION_DISCLAIMER,
} from "@/lib/affiliates";
import {
  getContactEmail,
  getOperatorName,
  isContactEmailConfigured,
  LEGAL_NAV_LINKS,
  SITE_NAME,
} from "@/lib/site";

const AFFILIATE_DISCLOSURE_GENERAL =
  "当サイトには、アフィリエイト広告（第三者の商品・サービスの紹介リンク）が含まれる場合があります。リンク経由で申し込みが行われた場合、運営者が報酬を受け取ることがあります。";

export function SiteFooter() {
  const partnersConfigured = hasConfiguredAffiliatePartners();
  const year = new Date().getFullYear();
  const operatorName = getOperatorName();
  const contactEmail = getContactEmail();
  const emailConfigured = isContactEmailConfigured();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white">
      <div className="mx-auto w-full max-w-5xl space-y-4 px-6 py-8 text-sm text-zinc-600">
        <nav
          aria-label="フッターナビゲーション"
          className="flex flex-wrap gap-x-4 gap-y-2"
        >
          {LEGAL_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-zinc-700 underline-offset-2 hover:text-emerald-800 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs leading-relaxed text-zinc-500">
          {partnersConfigured
            ? AFFILIATE_DISCLOSURE
            : AFFILIATE_DISCLOSURE_GENERAL}
        </p>

        <p className="leading-relaxed">{SIMULATION_DISCLAIMER}</p>

        {partnersConfigured ? (
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-zinc-500">準備の参考:</span>
            {getConfiguredAffiliatePartners().map((partner) => (
              <AffiliateLink
                key={partner.id}
                partner={partner.id}
                placement="footer"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                {partner.shortLabel}
              </AffiliateLink>
            ))}
          </p>
        ) : null}

        <p className="text-xs leading-relaxed text-zinc-500">
          運営: {operatorName}
          {" · "}
          {emailConfigured ? (
            <a
              href={`mailto:${contactEmail}`}
              className="text-emerald-700 underline-offset-2 hover:underline"
            >
              {contactEmail}
            </a>
          ) : (
            <Link
              href="/contact"
              className="text-emerald-700 underline-offset-2 hover:underline"
            >
              お問い合わせ
            </Link>
          )}
        </p>

        <p className="text-xs text-zinc-400">
          © {year} {SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
