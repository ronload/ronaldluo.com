import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/identity";

export function languagesFor(href: string, locales: readonly Locale[] = routing.locales) {
  const available = locales.length > 0 ? locales : routing.locales;
  const fallback = available.includes(routing.defaultLocale) ? routing.defaultLocale : available[0];

  return {
    ...Object.fromEntries(
      available.map((locale) => [locale, SITE_URL + getPathname({ locale, href })]),
    ),
    "x-default": SITE_URL + getPathname({ locale: fallback, href }),
  };
}

export function alternatesFor(locale: Locale, href: string, locales?: readonly Locale[]) {
  return {
    canonical: SITE_URL + getPathname({ locale, href }),
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
      url: SITE_URL + getPathname({ locale, href: path }),
      siteName: "Ronald Luo 羅永能",
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

interface NoteInput {
  locale: Locale;
  slug: string;
  title: string;
  description: string;
  date: string;
  modified?: Date;
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
      url: SITE_URL + getPathname({ locale, href }),
      siteName: "Ronald Luo 羅永能",
      title,
      description,
      publishedTime: date,
      modifiedTime: modified?.toISOString(),
      authors: [SITE_URL],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
