import type { FaqItem } from "@/lib/faqs";
import { getSiteUrl, SITE_NAME } from "@/lib/site";

type FaqJsonLdProps = {
  faqs: FaqItem[];
};

export function FaqJsonLd({ faqs }: FaqJsonLdProps) {
  const siteUrl = getSiteUrl();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: siteUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
