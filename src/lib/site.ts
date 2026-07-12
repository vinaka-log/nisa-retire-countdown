export const DEFAULT_SITE_URL =
  "https://nisa-retire-countdown.vercel.app";

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  return DEFAULT_SITE_URL;
}

/** Unique product brand (avoid generic「つみたてNISAシミュレーター」). */
export const SITE_NAME = "みつきリタイア";
export const SITE_TITLE = "みつきリタイア｜つみたてNISAで引退は何年後？";
export const SITE_DESCRIPTION =
  "みつきリタイアは、つみたてNISAの積立・利回り・目標から引退までのギャップを見える化する無料ツール。現状と目標の差を把握して、積立のモチベーションにつなげます。";
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
