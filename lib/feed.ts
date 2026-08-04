import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PERSON, SITE_URL } from "@/lib/identity";
import { pageUrl } from "@/lib/seo";
import { isFallbackNote, source } from "@/lib/source";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toIso(date: string) {
  return new Date(`${date}T00:00:00Z`).toISOString();
}

export async function buildAtomFeed(locale: Locale) {
  const t = await getTranslations({ locale, namespace: "Notes" });
  const notesUrl = pageUrl(locale, "/notes");
  const selfUrl = pageUrl(locale, "/feed.xml");

  const notes = source
    .getPages(locale)
    .filter((note) => !note.data.draft && !isFallbackNote(note, locale))
    .sort((a, b) => b.data.date.localeCompare(a.data.date));

  const updated = notes.reduce<string>((latest, note) => {
    const candidate = toIso(note.data.updated ?? note.data.date);
    return candidate > latest ? candidate : latest;
  }, toIso("1970-01-01"));

  const entries = notes.map((note) => {
    const url = pageUrl(locale, `/notes/${note.slugs[0]}`);

    return [
      "  <entry>",
      `    <id>${escapeXml(url)}</id>`,
      `    <title>${escapeXml(note.data.title)}</title>`,
      `    <link href="${escapeXml(url)}" rel="alternate" type="text/html"/>`,
      `    <published>${toIso(note.data.date)}</published>`,
      `    <updated>${toIso(note.data.updated ?? note.data.date)}</updated>`,
      `    <summary type="text">${escapeXml(note.data.description)}</summary>`,
      "  </entry>",
    ].join("\n");
  });

  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    `<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${locale}">`,
    `  <id>${escapeXml(notesUrl)}</id>`,
    `  <title>${escapeXml(`${t("title")} | ${PERSON.nameEn} ${PERSON.nameZh}`)}</title>`,
    `  <subtitle>${escapeXml(t("description"))}</subtitle>`,
    `  <updated>${updated}</updated>`,
    `  <link href="${escapeXml(notesUrl)}" rel="alternate" type="text/html"/>`,
    `  <link href="${escapeXml(selfUrl)}" rel="self" type="application/atom+xml"/>`,
    "  <author>",
    `    <name>${escapeXml(`${PERSON.nameEn} (${PERSON.nameZh})`)}</name>`,
    `    <uri>${SITE_URL}</uri>`,
    `    <email>${PERSON.email}</email>`,
    "  </author>",
    ...entries,
    "</feed>",
    "",
  ].join("\n");
}

export function feedResponse(body: string) {
  return new Response(body, {
    headers: { "content-type": "application/atom+xml; charset=utf-8" },
  });
}
