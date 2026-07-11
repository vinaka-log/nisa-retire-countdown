import {
  getSiteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
} from "@/lib/site";

export function JsonLd() {
  const siteUrl = getSiteUrl();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "ja",
        publisher: {
          "@id": `${siteUrl}/#app`,
        },
      },
      {
        "@type": "WebApplication",
        "@id": `${siteUrl}/#app`,
        name: SITE_NAME,
        alternateName: SITE_TITLE,
        url: siteUrl,
        description: SITE_DESCRIPTION,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        inLanguage: "ja",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "JPY",
        },
      },
    ],
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
