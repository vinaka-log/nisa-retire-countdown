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
      className={`rounded-xl border border-zinc-200 bg-white p-4 ${className}`}
      aria-label="次の準備"
    >
      <p className="text-xs text-zinc-500">{AFFILIATE_DISCLOSURE}</p>
      <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-800">
        シミュレーション結果を踏まえて、つみたてNISA対応の口座を調べる
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        準備のための参考リンクです。無理に申し込む必要はありません。
      </p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {partners.map((partner, index) => (
          <AffiliateLink
            key={partner.id}
            partner={partner.id}
            placement={placement}
            className={
              index === 0
                ? "inline-flex items-center justify-center rounded-lg border border-emerald-700 bg-emerald-700 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
                : "inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            }
          >
            {partner.ctaLabel}
          </AffiliateLink>
        ))}
      </div>
    </aside>
  );
}
