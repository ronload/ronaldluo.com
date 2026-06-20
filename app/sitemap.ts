import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { LAST_UPDATED, SITE_URL } from "@/lib/identity";
import { languagesFor } from "@/lib/seo";

const PAGES = ["/", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((href) => ({
    url: SITE_URL + getPathname({ locale: routing.defaultLocale, href }),
    lastModified: LAST_UPDATED,
    changeFrequency: "monthly" as const,
    priority: href === "/" ? 1 : 0.7,
    alternates: { languages: languagesFor(href) },
  }));
}
