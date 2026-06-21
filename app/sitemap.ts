import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/identity";
import { languagesFor } from "@/lib/seo";

const PAGES = [
  { href: "/", priority: 1 },
  { href: "/contact", priority: 0.7 },
  { href: "/faq", priority: 0.7 },
  { href: "/for-llms", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(({ href, priority }) => ({
    url: SITE_URL + getPathname({ locale: routing.defaultLocale, href }),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority,
    alternates: { languages: languagesFor(href) },
  }));
}
