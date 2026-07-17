import type { MetadataRoute } from "next";
import { GUIDES } from "@/lib/guides";
import { getSiteUrl, SITEMAP_PATHS } from "@/lib/site";

const GUIDE_DATES = Object.fromEntries(
  GUIDES.map((guide) => [`/guides/${guide.slug}`, guide.updatedAt]),
);

/** Static pages without per-guide dates — last editorial pass. */
const PAGE_DATES: Record<string, string> = {
  "/": "2026-07-14",
  "/guides": "2026-07-14",
  "/about": "2026-07-14",
  "/faq": "2026-07-17",
  "/contact": "2026-07-12",
  "/privacy": "2026-07-12",
  "/terms": "2026-07-12",
  "/disclaimer": "2026-07-12",
  ...GUIDE_DATES,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return SITEMAP_PATHS.map((path) => ({
    url: path === "/" ? siteUrl : `${siteUrl}${path}`,
    lastModified: new Date(PAGE_DATES[path] ?? "2026-07-12"),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority:
      path === "/"
        ? 1
        : path === "/guides" || path.startsWith("/guides/")
          ? 0.8
          : 0.6,
  }));
}
