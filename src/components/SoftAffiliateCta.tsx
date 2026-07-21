import { AffiliateLink } from "@/components/AffiliateLink";
import {
  AFFILIATE_DISCLOSURE,
  getConfiguredAffiliatePartners,
  type AffiliatePlacement,
} from "@/lib/affiliates";

type SoftAffiliateCtaProps = {
  placement: AffiliatePlacement;
  className?: string;
};

export function SoftAffiliateCta({
  placement,
  className = "",
}: SoftAffiliateCtaProps) {
  const partners = getConfiguredAffiliatePartners();
  if (partners.length === 0) return null;

  return (
    <aside
      className={`soft-affiliate ${className}`.trim()}
      aria-label="次の準備"
    >
      <p className="soft-affiliate-disclosure">{AFFILIATE_DISCLOSURE}</p>
      <p className="soft-affiliate-title">
        シミュレーション結果を踏まえて、つみたてNISA対応の口座を調べる
      </p>
      <p className="soft-affiliate-note">
        準備のための参考リンクです。無理に申し込む必要はありません。
      </p>

      <div className="soft-affiliate-actions">
        {partners.map((partner, index) => (
          <AffiliateLink
            key={partner.id}
            partner={partner.id}
            placement={placement}
            className={
              index === 0
                ? "soft-affiliate-btn-primary"
                : "soft-affiliate-btn-secondary"
            }
          >
            {partner.ctaLabel}
          </AffiliateLink>
        ))}
      </div>
    </aside>
  );
}
