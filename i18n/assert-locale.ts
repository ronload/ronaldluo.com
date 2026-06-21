import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { type Locale, routing } from "./routing";

export function assertLocale(locale: string): asserts locale is Locale {
  if (!hasLocale(routing.locales, locale)) return notFound();
}
