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
