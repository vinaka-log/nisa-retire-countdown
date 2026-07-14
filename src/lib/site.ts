export const DEFAULT_SITE_URL =
  "https://nisa-retire-countdown.vercel.app";

function normalizeSiteUrl(raw: string): string {
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/$/, "");
}

/**
 * Canonical site origin for metadata / sitemap / JSON-LD / OG.
 * Prefer NEXT_PUBLIC_SITE_URL (custom domain). Falls back to Vercel
 * production host, then the default *.vercel.app URL.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return normalizeSiteUrl(fromEnv);
  }

  const vercelProduction =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProduction) {
    return normalizeSiteUrl(vercelProduction);
  }

  return DEFAULT_SITE_URL;
}

/** Hostname only (for OG image footer, etc.). */
export function getSiteHost(): string {
  try {
    return new URL(getSiteUrl()).host;
  } catch {
    return DEFAULT_SITE_URL.replace(/^https?:\/\//, "");
  }
}

/** Unique product brand (avoid generic「つみたてNISAシミュレーター」). */
export const SITE_NAME = "みつきリタイア";
/** Short product type — clarifies what the brand name alone doesn't. */
export const SITE_PRODUCT_LABEL = "引退ギャップシミュレーター";
/** First-visit headline: answers "what does this site do?" */
export const SITE_HEADLINE = "つみたてNISAで、引退まであとどれくらい？";
export const SITE_LEAD =
  "積立・利回り・目標を動かすと、目標までの不足額がすぐわかります";
export const SITE_TITLE = `${SITE_HEADLINE}｜${SITE_NAME}`;
export const SITE_DESCRIPTION =
  `${SITE_NAME}は、つみたてNISAの積立・利回り・目標から引退までのギャップを見える化する無料の${SITE_PRODUCT_LABEL}です。現状と目標の差を把握して、積立のモチベーションにつなげます。`;
export const SITE_KEYWORDS = [
  "みつきリタイア",
  "つみたてNISA",
  "NISA",
  "引退シミュレーション",
  "積立投資",
  "老後資金",
  "資産形成",
  "新NISA",
  "FIRE",
];

export {
  getContactEmail,
  getContactEmailDisplay,
  getOperatorAddress,
  hasOperatorAddress,
  isContactEmailConfigured,
} from "@/lib/site-config";

export const LEGAL_NAV_LINKS = [
  { href: "/about", label: "運営者情報" },
  { href: "/guides", label: "ガイド" },
  { href: "/faq", label: "FAQ・ヘルプ" },
  { href: "/contact", label: "お問い合わせ" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/terms", label: "利用規約" },
  { href: "/disclaimer", label: "免責事項" },
] as const;

export const HEADER_NAV_LINKS = [
  { href: "/", label: "ホーム" },
  { href: "/guides", label: "ガイド" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "お問い合わせ" },
  { href: "/about", label: "運営者情報" },
] as const;

export const SITEMAP_PATHS = [
  "/",
  "/guides",
  "/guides/retirement-funds",
  "/guides/nisa-simulation",
  "/guides/4-percent-rule",
  "/about",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
] as const;
