type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Fire a GA4 event when gtag is loaded; no-op otherwise. */
export function trackEvent(name: string, params?: GtagParams): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}

export function trackAffiliateClick(
  partner: string,
  placement: string,
): void {
  trackEvent("affiliate_click", {
    partner,
    placement,
    transport_type: "beacon",
  });
}

export function trackShare(method: "x" | "line" | "native"): void {
  trackEvent("share", {
    method,
    content_type: "retire_gap",
  });
}
