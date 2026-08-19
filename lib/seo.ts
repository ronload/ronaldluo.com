import type { Metadata, ResolvingMetadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/lib/identity";

export const pageUrl = (locale: Locale, href: string) => SITE_URL + getPathname({ locale, href });

export const canonicalUrl = (locale: Locale, href: string) =>
  pageUrl(locale, href).replace(/\/$/, "");

export const TITLE_TEMPLATE = `%s | ${SITE_NAME}`;

export const formatTitle = (title: string) => TITLE_TEMPLATE.replace("%s", title);

export const FEED_ALTERNATES = {
  "application/atom+xml": routing.locales.map((locale) => ({
    url: pageUrl(locale, "/feed.xml"),
    title: `Notes (${locale})`,
  })),
};

export function languagesFor(href: string, locales: readonly Locale[] = routing.locales) {
  const available = locales.length > 0 ? locales : routing.locales;
  const fallback = available.includes(routing.defaultLocale) ? routing.defaultLocale : available[0];

  return {
    ...Object.fromEntries(available.map((locale) => [locale, pageUrl(locale, href)])),
    "x-default": pageUrl(fallback, href),
  };
}

export function alternatesFor(locale: Locale, href: string, locales?: readonly Locale[]) {
  return {
    canonical: canonicalUrl(locale, href),
    languages: languagesFor(href, locales),
  };
}

interface SocialInput {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}

export function socialMetadata({
  locale,
  path,
  title,
  description,
}: SocialInput): Pick<Metadata, "description" | "alternates" | "openGraph" | "twitter"> {
  const isZh = locale === "zh-TW";

  return {
    description,
    alternates: alternatesFor(locale, path),
    openGraph: {
      type: "profile",
      locale: isZh ? "zh_TW" : "en_US",
      alternateLocale: isZh ? "en_US" : "zh_TW",
      firstName: "Ronald",
      lastName: "Luo",
      url: pageUrl(locale, path),
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export async function withInheritedOpenGraphImages(
  metadata: Metadata,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const images = (await parent).openGraph?.images;

  if (!metadata.openGraph || metadata.openGraph.images || !images) return metadata;

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images,
    },
  };
}

interface NoteInput {
  locale: Locale;
  slug: string;
  title: string;
  description: string;
  date: string;
  modified?: string;
  locales: readonly Locale[];
  fallback: boolean;
}

export function noteMetadata({
  locale,
  slug,
  title,
  description,
  date,
  modified,
  locales,
  fallback,
}: NoteInput): Metadata {
  const href = `/notes/${slug}`;

  return {
    title,
    description,
    ...(fallback
      ? { robots: { index: false, follow: true }, alternates: { canonical: null } }
      : { alternates: alternatesFor(locale, href, locales) }),
    openGraph: {
      type: "article",
      locale: locale === "zh-TW" ? "zh_TW" : "en_US",
      url: pageUrl(locale, href),
      siteName: SITE_NAME,
      title,
      description,
      publishedTime: date,
      modifiedTime: modified,
      authors: [SITE_URL],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
