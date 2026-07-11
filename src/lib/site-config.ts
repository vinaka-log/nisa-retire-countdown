/**
 * Public operator / contact configuration.
 * Empty env values are omitted from UI (never show「公開時に記入」or raw env names).
 */

/** Matches SITE_NAME + 「運営」 — keep in sync with `@/lib/site`. */
export const DEFAULT_OPERATOR_NAME = "つみたてNISAシミュレーター運営";

export const GITHUB_REPO_URL =
  "https://github.com/vinaka-log/nisa-retire-countdown";

function envTrimmed(key: string): string {
  return process.env[key]?.trim() ?? "";
}

/**
 * Display name for 運営者情報.
 * Env empty → professional site-label fallback.
 */
export function getOperatorName(): string {
  const fromEnv = envTrimmed("NEXT_PUBLIC_OPERATOR_NAME");
  return fromEnv.length > 0 ? fromEnv : DEFAULT_OPERATOR_NAME;
}

/**
 * Optional mailing address. Empty string when unset — omit the row from UI.
 */
export function getOperatorAddress(): string {
  return envTrimmed("NEXT_PUBLIC_OPERATOR_ADDRESS");
}

export function hasOperatorAddress(): boolean {
  return getOperatorAddress().length > 0;
}

/**
 * Contact email for mailto. Empty string when unset (do not invent an address).
 */
export function getContactEmail(): string {
  return envTrimmed("NEXT_PUBLIC_CONTACT_EMAIL");
}

export function isContactEmailConfigured(): boolean {
  const email = getContactEmail();
  return email.length > 0 && email.includes("@");
}

/** Human-readable contact email, or empty when unset (caller should omit). */
export function getContactEmailDisplay(): string {
  return isContactEmailConfigured() ? getContactEmail() : "";
}

export function getGithubIssuesUrl(): string {
  return `${GITHUB_REPO_URL}/issues`;
}

export function getGithubNewIssueUrl(params?: {
  title?: string;
  body?: string;
}): string {
  const search = new URLSearchParams();
  if (params?.title) search.set("title", params.title);
  if (params?.body) search.set("body", params.body);
  const qs = search.toString();
  return qs
    ? `${GITHUB_REPO_URL}/issues/new?${qs}`
    : `${GITHUB_REPO_URL}/issues/new`;
}
