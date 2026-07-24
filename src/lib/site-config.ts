/**
 * Public operator / contact configuration.
 * Empty env values are omitted from UI (never show「公開時に記入」or raw env names).
 * No personal operator name is published; contact via email / form only.
 * Use static process.env.NEXT_PUBLIC_* access for client bundle inlining.
 */

/**
 * Optional mailing address. Empty string when unset — omit the row from UI.
 */
export function getOperatorAddress(): string {
  return process.env.NEXT_PUBLIC_OPERATOR_ADDRESS?.trim() ?? "";
}

export function hasOperatorAddress(): boolean {
  return getOperatorAddress().length > 0;
}

/**
 * Contact email for mailto. Empty string when unset (do not invent an address).
 * Required for production contact — set NEXT_PUBLIC_CONTACT_EMAIL in Vercel.
 */
export function getContactEmail(): string {
  return process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "";
}

export function isContactEmailConfigured(): boolean {
  const email = getContactEmail();
  return email.length > 0 && email.includes("@");
}

/** Human-readable contact email, or empty when unset (caller should omit). */
export function getContactEmailDisplay(): string {
  return isContactEmailConfigured() ? getContactEmail() : "";
}
