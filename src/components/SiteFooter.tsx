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
  isContactEmailConfigured,
  LEGAL_NAV_LINKS,
  SITE_NAME,
} from "@/lib/site";

const AFFILIATE_DISCLOSURE_GENERAL =
  "当サイトには、アフィリエイト広告（第三者の商品・サービスの紹介リンク）が含まれる場合があります。リンク経由で申し込みが行われた場合、運営者が報酬を受け取ることがあります。";

export function SiteFooter() {
  const partnersConfigured = hasConfiguredAffiliatePartners();
  const year = new Date().getFullYear();
  const contactEmail = getContactEmail();
  const emailConfigured = isContactEmailConfigured();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <nav aria-label="フッターナビゲーション" className="site-footer-nav">
          {LEGAL_NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="site-footer-note">
          {partnersConfigured
            ? AFFILIATE_DISCLOSURE
            : AFFILIATE_DISCLOSURE_GENERAL}
        </p>

        <p className="site-footer-body">{SIMULATION_DISCLAIMER}</p>

        {partnersConfigured ? (
          <p className="site-footer-partners">
            <span className="site-footer-partners-label">準備の参考:</span>
            {getConfiguredAffiliatePartners().map((partner) => (
              <AffiliateLink
                key={partner.id}
                partner={partner.id}
                placement="footer"
                className="site-footer-link"
              >
                {partner.shortLabel}
              </AffiliateLink>
            ))}
          </p>
        ) : null}

        <p className="site-footer-note">
          お問い合わせ:{" "}
          {emailConfigured ? (
            <a href={`mailto:${contactEmail}`} className="site-footer-link">
              {contactEmail}
            </a>
          ) : (
            <Link href="/contact" className="site-footer-link">
              お問い合わせフォーム
            </Link>
          )}
        </p>

        <p className="site-footer-copy">
          © {year} {SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
