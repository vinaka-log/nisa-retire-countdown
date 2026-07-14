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
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: guide.title,
        description: guide.description,
        datePublished: guide.publishedAt,
        dateModified: guide.updatedAt,
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
            url: `${siteUrl}/characters/tarumi-idle.webp`,
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "ホーム",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "ガイド",
            item: `${siteUrl}/guides`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: guide.title,
            item: url,
          },
        ],
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
