import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
};

/** Page metadata with explicit OG/Twitter fields (avoids inheriting homepage OG). */
export function pageMetadata({
  title,
  description,
  path,
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
      type: "website",
      locale: "ja_JP",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  };
}
