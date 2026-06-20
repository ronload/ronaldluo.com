import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/identity";

const PAGES = ["/", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((href) => {
    const languages: Record<string, string> = {};

    for (const l of routing.locales) {
      languages[l] = SITE_URL + getPathname({ locale: l, href });
    }

    languages["x-default"] = SITE_URL + getPathname({ locale: routing.defaultLocale, href });

    return {
      url: SITE_URL + getPathname({ locale: routing.defaultLocale, href }),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: href === "/" ? 1 : 0.7,
      alternates: { languages },
    };
  });
}
