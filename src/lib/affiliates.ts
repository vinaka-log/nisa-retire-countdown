/**
 * Affiliate partner config for soft CTAs.
 * Swap placeholder / env URLs for real ASP links when ready.
 * Do not invent broker endorsements in copy or defaults.
 *
 * CTAs stay hidden until NEXT_PUBLIC_AFFILIATE_* is a real http(s) URL.
 */

export type AffiliatePartnerId = "securities" | "credit_card";

export type AffiliatePlacement = "motivation_board" | "footer" | "guide";

export const AFFILIATE_DISCLOSURE = "広告・アフィリエイトを含みます";

export const SIMULATION_DISCLAIMER =
  "本シミュレーションは概算の目安であり、投資助言ではありません。将来の運用成果を保証するものではなく、「4%ルール」は一般的な取り崩しの仮定に基づいています。";

type PartnerConfig = {
  id: AffiliatePartnerId;
  /** Short label for secondary UI (footer links, etc.) */
  shortLabel: string;
  /** Primary button label */
  ctaLabel: string;
  /**
   * Destination URL. Prefer env so ASP links can be swapped without code changes.
   * Empty / "#" until a real URL is configured — UI will not render.
   */
  url: string;
};

/** Static process.env.NEXT_PUBLIC_* access required for client bundle inlining. */
function envUrl(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : "#";
}

/** True when the partner URL is a real http(s) destination (not unset / "#"). */
export function isAffiliateUrlConfigured(url: string): boolean {
  return /^https?:\/\//i.test(url.trim());
}

export const AFFILIATE_PARTNERS: Record<AffiliatePartnerId, PartnerConfig> = {
  securities: {
    id: "securities",
    shortLabel: "つみたてNISA口座",
    ctaLabel: "つみたてNISA対応の口座を調べる",
    url: envUrl(process.env.NEXT_PUBLIC_AFFILIATE_SECURITIES_URL),
  },
  credit_card: {
    id: "credit_card",
    shortLabel: "エポスカード",
    ctaLabel: "エポスカードでポイント還元を見る",
    url: envUrl(process.env.NEXT_PUBLIC_AFFILIATE_CREDIT_CARD_URL),
  },
};

/** Partners with a real http(s) URL ready for CTAs. */
export function getConfiguredAffiliatePartners(): PartnerConfig[] {
  return (Object.values(AFFILIATE_PARTNERS) as PartnerConfig[]).filter((p) =>
    isAffiliateUrlConfigured(p.url),
  );
}

export function hasConfiguredAffiliatePartners(): boolean {
  return getConfiguredAffiliatePartners().length > 0;
}

const UTM_SOURCE = "nisa_retire";
const UTM_MEDIUM = "affiliate";

/**
 * Append standard UTM params. Leaves unset / "#" unchanged so partners stay inert.
 */
export function buildAffiliateUrl(
  baseUrl: string,
  partner: AffiliatePartnerId,
  placement: AffiliatePlacement,
): string {
  if (!isAffiliateUrlConfigured(baseUrl)) return "#";

  try {
    const url = new URL(baseUrl);
    url.searchParams.set("utm_source", UTM_SOURCE);
    url.searchParams.set("utm_medium", UTM_MEDIUM);
    url.searchParams.set("utm_campaign", partner);
    url.searchParams.set("utm_content", placement);
    return url.toString();
  } catch {
    const sep = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${sep}utm_source=${UTM_SOURCE}&utm_medium=${UTM_MEDIUM}&utm_campaign=${encodeURIComponent(partner)}&utm_content=${encodeURIComponent(placement)}`;
  }
}
