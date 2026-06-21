import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/identity";

export function languagesFor(href: string) {
  return {
    ...Object.fromEntries(
      routing.locales.map((locale) => [locale, SITE_URL + getPathname({ locale, href })]),
    ),
    "x-default": SITE_URL + getPathname({ locale: routing.defaultLocale, href }),
  };
}

export function alternatesFor(locale: Locale, href: string) {
  return {
    canonical: SITE_URL + getPathname({ locale, href }),
    languages: languagesFor(href),
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
