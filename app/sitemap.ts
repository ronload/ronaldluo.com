import type { MetadataRoute } from "next";
import { type Locale, routing } from "@/i18n/routing";
import { languagesFor, pageUrl } from "@/lib/seo";
import { isFallbackNote, noteLocales, source } from "@/lib/source";

const PAGES = [
  { href: "/", priority: 1 },
  { href: "/notes", priority: 0.8 },
  { href: "/contact", priority: 0.7 },
  { href: "/faq", priority: 0.7 },
  { href: "/for-llms", priority: 0.5 },
];

interface NoteEntry {
  href: string;
  locale: Locale;
  locales: readonly Locale[];
  date: string;
  updated?: string;
}

function noteEntries(): NoteEntry[] {
  const seen = new Set<string>();
  const entries: NoteEntry[] = [];

  for (const locale of routing.locales) {
    for (const note of source.getPages(locale)) {
      const slug = note.slugs[0];
      if (note.data.draft || isFallbackNote(note, locale) || seen.has(slug)) continue;

      seen.add(slug);
      entries.push({
        href: `/notes/${slug}`,
        locale,
        locales: noteLocales(slug),
        date: note.data.date,
        updated: note.data.updated,
      });
    }
  }

  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map(({ href, priority }) => ({
      url: pageUrl(routing.defaultLocale, href),
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: languagesFor(href) },
    })),
    ...noteEntries().map(({ href, locale, locales, date, updated }) => ({
      url: pageUrl(locale, href),
      lastModified: updated ?? date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages: languagesFor(href, locales) },
    })),
  ];
}
