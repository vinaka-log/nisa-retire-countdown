"use client";

import {
  AFFILIATE_PARTNERS,
  buildAffiliateUrl,
  isAffiliateUrlConfigured,
  type AffiliatePartnerId,
  type AffiliatePlacement,
} from "@/lib/affiliates";
import { trackAffiliateClick } from "@/lib/analytics";

type AffiliateLinkProps = {
  partner: AffiliatePartnerId;
  placement: AffiliatePlacement;
  className?: string;
  children: React.ReactNode;
};

export function AffiliateLink({
  partner,
  placement,
  className,
  children,
}: AffiliateLinkProps) {
  const config = AFFILIATE_PARTNERS[partner];
  if (!isAffiliateUrlConfigured(config.url)) return null;

  const href = buildAffiliateUrl(config.url, partner, placement);

  return (
    <a
      href={href}
      className={className}
      rel="sponsored noopener noreferrer"
      target="_blank"
      onClick={() => trackAffiliateClick(partner, placement)}
    >
      {children}
    </a>
  );
}
