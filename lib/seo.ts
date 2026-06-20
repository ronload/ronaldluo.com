import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/identity";

export function alternatesFor(locale: string, href: string) {
  const languages: Record<string, string> = {};

  for (const l of routing.locales) {
    languages[l] = SITE_URL + getPathname({ locale: l, href });
  }

  languages["x-default"] = SITE_URL + getPathname({ locale: routing.defaultLocale, href });

  return {
    canonical: SITE_URL + getPathname({ locale, href }),
    languages,
  };
}

interface SocialInput {
  locale: string;
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
