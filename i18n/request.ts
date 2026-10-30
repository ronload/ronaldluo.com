import { locale as rootLocale } from "next/root-params";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async (params) => {
  // global-not-found renders outside [locale] and gets no root param, so it
  // falls back to the locale the proxy matched for the URL. That fallback
  // reads request headers, so it must never run for the static pages.
  const requested = params.locale ?? (await rootLocale()) ?? (await params.requestLocale);
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    timeZone: "Asia/Taipei",
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
