import Link from "next/link";
import {
  HEADER_NAV_LINKS,
  SITE_NAME,
  SITE_PRODUCT_LABEL,
} from "@/lib/site";

/** Secondary destinations stay in the footer; omit from the compact header row. */
const COMPACT_HIDDEN_HREFS = new Set(["/contact", "/about"]);

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link
          href="/"
          title={`${SITE_NAME}｜${SITE_PRODUCT_LABEL}`}
          className="site-header-brand"
        >
          <span className="site-header-brand-name">{SITE_NAME}</span>
          <span className="site-header-brand-label">{SITE_PRODUCT_LABEL}</span>
        </Link>
        <nav
          aria-label="メインナビゲーション"
          className="site-header-nav"
        >
          {HEADER_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                COMPACT_HIDDEN_HREFS.has(link.href)
                  ? "site-header-nav-secondary"
                  : undefined
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
