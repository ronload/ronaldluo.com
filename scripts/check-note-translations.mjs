import { readdirSync } from "node:fs";
import { join } from "node:path";

const NOTES_DIR = join(process.cwd(), "content", "notes");
const MESSAGES_DIR = join(process.cwd(), "messages");

const locales = readdirSync(MESSAGES_DIR)
  .filter((name) => name.endsWith(".json"))
  .map((name) => name.slice(0, -".json".length));

let files;
try {
  files = readdirSync(NOTES_DIR);
} catch {
  process.exit(0);
}

const bySlug = new Map();
for (const file of files) {
  const match = file.match(/^(.+)\.([^.]+)\.mdx$/);
  if (!match) continue;
  const [, slug, locale] = match;
  if (!locales.includes(locale)) continue;
  if (!bySlug.has(slug)) bySlug.set(slug, new Set());
  bySlug.get(slug).add(locale);
}

const missing = [];
for (const [slug, present] of bySlug) {
  for (const locale of locales) {
    if (!present.has(locale)) missing.push({ slug, locale });
  }
}

if (missing.length === 0) process.exit(0);

const annotate = Boolean(process.env.GITHUB_ACTIONS);
for (const { slug, locale } of missing) {
  const message = `content/notes/${slug}.${locale}.mdx is missing; /${locale}/notes/${slug} will serve the fallback locale and be marked noindex.`;
  console.warn(annotate ? `::warning::${message}` : `warning: ${message}`);
}

console.warn(`\n${missing.length} note translation(s) missing across ${bySlug.size} note(s).`);
