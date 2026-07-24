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

type CtaCopy = {
  title: string;
  body: string;
  note: string;
};

function copyForPartners(
  hasSecurities: boolean,
  hasCreditCard: boolean,
): CtaCopy {
  if (hasSecurities && hasCreditCard) {
    return {
      title: "ギャップを縮める準備を、いまの結果から進める",
      body: "口座で積立の土台をつくり、日常の支払いポイントで余力を足す。どちらも「達成までの距離」を短くする選択肢です。",
      note: "準備のための参考リンクです。条件は各公式サイトでご確認ください。無理に申し込む必要はありません。",
    };
  }

  if (hasSecurities) {
    return {
      title: "シミュレーション結果を踏まえて、つみたてNISA対応の口座を調べる",
      body: "積立額を上げる前に、続けやすい口座の条件も確認しておくと動きやすいです。",
      note: "準備のための参考リンクです。無理に申し込む必要はありません。",
    };
  }

  if (hasCreditCard) {
    return {
      title: "積立を増やすだけが、ギャップを縮める方法ではありません",
      body: "毎月の支出からポイントを取りこぼさなければ、その分を積立の余力に回せます。支払いの見直しも、達成までの距離を縮める一手です。",
      note: "クレジットカードの紹介リンクです。年会費・還元率などは公式サイトでご確認ください。無理に申し込む必要はありません。",
    };
  }

  return {
    title: "シミュレーション結果を踏まえて、次の準備を調べる",
    body: "準備のための参考リンクです。",
    note: "無理に申し込む必要はありません。",
  };
}

export function SoftAffiliateCta({
  placement,
  className = "",
}: SoftAffiliateCtaProps) {
  const partners = getConfiguredAffiliatePartners();
  if (partners.length === 0) return null;

  const hasSecurities = partners.some((p) => p.id === "securities");
  const hasCreditCard = partners.some((p) => p.id === "credit_card");
  const { title, body, note } = copyForPartners(hasSecurities, hasCreditCard);

  return (
    <aside
      className={`soft-affiliate ${className}`.trim()}
      aria-label="次の準備"
    >
      <p className="soft-affiliate-disclosure">{AFFILIATE_DISCLOSURE}</p>
      <p className="soft-affiliate-title">{title}</p>
      <p className="soft-affiliate-body">{body}</p>
      <p className="soft-affiliate-note">{note}</p>

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
