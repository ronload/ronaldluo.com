import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // All locales that are supported
  locales: ["en", "zh-TW"],

  // Used when no locale matches
  defaultLocale: "en",

  // Always include the locale prefix in the pathname (e.g. `/en`, `/zh-TW`)
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
