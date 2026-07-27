import { defineI18n } from "fumadocs-core/i18n";
import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { notes } from "@/.source/server";
import { routing } from "@/i18n/routing";

export const i18n = defineI18n({
  languages: [...routing.locales],
  defaultLanguage: routing.defaultLocale,
  fallbackLanguage: "zh-TW",
  hideLocale: "default-locale",
});

export const source = loader({
  source: toFumadocsSource(notes, []),
  baseUrl: "/notes",
  i18n,
});

export type Note = ReturnType<typeof source.getPages>[number];

export function isFallbackNote(note: Note, locale: string) {
  return locale !== "zh-TW" && note.data.info.fullPath.endsWith(".zh-TW.mdx");
}

export function noteLocales(slug: string) {
  return routing.locales.filter((locale) => {
    const note = source.getPage([slug], locale);
    return note !== undefined && !isFallbackNote(note, locale);
  });
}
