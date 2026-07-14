import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Open Graph type. Use "article" for guide pages. */
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

/** Page metadata with explicit OG/Twitter fields (avoids inheriting homepage OG). */
export function pageMetadata({
  title,
  description,
  path,
  ogType = "website",
  publishedTime,
  modifiedTime,
}: PageMetaInput): Metadata {
  const ogTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      type: ogType,
      locale: "ja_JP",
      siteName: SITE_NAME,
      ...(ogType === "article" && publishedTime
        ? {
            publishedTime,
            modifiedTime: modifiedTime ?? publishedTime,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  };
}
