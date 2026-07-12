import type { GuideMeta } from "@/lib/guides";
import { getSiteUrl, SITE_NAME } from "@/lib/site";

type GuideJsonLdProps = {
  guide: GuideMeta;
};

export function GuideJsonLd({ guide }: GuideJsonLdProps) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/guides/${guide.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.publishedAt,
    inLanguage: "ja",
    mainEntityOfPage: url,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/characters/tarumi-idle.png`,
      },
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
