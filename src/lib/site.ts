export const DEFAULT_SITE_URL =
  "https://nisa-retire-countdown.vercel.app";

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  return DEFAULT_SITE_URL;
}

export const SITE_NAME = "つみたてNISAシミュレーター";
export const SITE_TITLE = "つみたてNISAで、引退は何年後？";
export const SITE_DESCRIPTION =
  "つみたてNISAの積立額・想定利回り・目標金額から、引退まで何年かかるかをかんたんにシミュレーション。老後資金の目安をすぐに確認できます。";
export const SITE_KEYWORDS = [
  "つみたてNISA",
  "NISA",
  "シミュレーター",
  "積立投資",
  "老後資金",
  "引退",
  "資産形成",
  "投資シミュレーション",
  "新NISA",
];

/** Placeholder shown until the operator fills NEXT_PUBLIC_* env vars. */
export const OPERATOR_PLACEHOLDER = "公開時に記入";

function envOrPlaceholder(key: string): string {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : OPERATOR_PLACEHOLDER;
}

/** Display name for 運営者情報 (個人名・サービス名など). */
export function getOperatorName(): string {
  return envOrPlaceholder("NEXT_PUBLIC_OPERATOR_NAME");
}

/** Optional mailing address for 運営者情報. */
export function getOperatorAddress(): string {
  return envOrPlaceholder("NEXT_PUBLIC_OPERATOR_ADDRESS");
}

/**
 * Contact email for mailto. Empty string when unset
 * (do not fall back to a fake address for links/forms).
 */
export function getContactEmail(): string {
  return process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "";
}

export function isContactEmailConfigured(): boolean {
  const email = getContactEmail();
  return email.length > 0 && email.includes("@");
}

/** Human-readable contact email (placeholder when unset). */
export function getContactEmailDisplay(): string {
  return isContactEmailConfigured()
    ? getContactEmail()
    : OPERATOR_PLACEHOLDER;
}

export const LEGAL_NAV_LINKS = [
  { href: "/about", label: "運営者情報" },
  { href: "/faq", label: "FAQ・ヘルプ" },
  { href: "/contact", label: "お問い合わせ" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/terms", label: "利用規約" },
  { href: "/disclaimer", label: "免責事項" },
] as const;

export const HEADER_NAV_LINKS = [
  { href: "/", label: "ホーム" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "お問い合わせ" },
  { href: "/about", label: "運営者情報" },
] as const;

export const SITEMAP_PATHS = [
  "/",
  "/about",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
] as const;
