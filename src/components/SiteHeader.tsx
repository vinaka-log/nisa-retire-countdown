import Link from "next/link";
import { HEADER_NAV_LINKS, SITE_NAME } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link
          href="/"
          title={SITE_NAME}
          className="site-header-brand"
        >
          {SITE_NAME}
        </Link>
        <nav
          aria-label="メインナビゲーション"
          className="site-header-nav flex items-center gap-x-4 text-sm"
        >
          {HEADER_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
