import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "zh-TW"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
