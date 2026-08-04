import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const NOTES_DIR = join(process.cwd(), "content", "notes");
const MESSAGES_DIR = join(process.cwd(), "messages");

const FRONTMATTER_REQUIRED = ["title", "description", "date"];
const FRONTMATTER_ALLOWED = new Set([...FRONTMATTER_REQUIRED, "updated", "draft"]);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const FENCE_META_ALLOWED = /^(?:title="[^"]+"|noCopy)$/;
const HAN = "\\u3400-\\u4dbf\\u4e00-\\u9fff\\uf900-\\ufaff";
const CJK_PUNCT = "\\u3000-\\u303f\\uff01-\\uff60";
const EMOJI = /[\u{1f000}-\u{1faff}\u{2600}-\u{27bf}]|\u{fe0f}/u;

const errors = [];
const warnings = [];

function stripInlineCode(line) {
  return line.replace(/`[^`]*`/g, (m) => " ".repeat(m.length));
}

function parseNote(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  const [, raw, body] = match;
  const frontmatter = new Map();
  for (const line of raw.split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/);
    if (kv) frontmatter.set(kv[1], kv[2].trim());
  }
  const offset = text.slice(0, text.length - body.length).split(/\r?\n/).length - 1;
  return { frontmatter, body, offset };
}

function proseLines(body, offset) {
  const out = [];
  let inFence = false;
  body.split(/\r?\n/).forEach((line, i) => {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      return;
    }
    if (!inFence) out.push({ line, lineNumber: offset + i + 1 });
  });
  return out;
}

function fenceInfoStrings(body, offset) {
  const out = [];
  let inFence = false;
  body.split(/\r?\n/).forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith("```")) return;
    if (!inFence) out.push({ info: trimmed.slice(3).trim(), lineNumber: offset + i + 1 });
    inFence = !inFence;
  });
  return out;
}

const locales = readdirSync(MESSAGES_DIR)
  .filter((name) => name.endsWith(".json"))
  .map((name) => name.slice(0, -".json".length));

let files;
try {
  files = readdirSync(NOTES_DIR);
} catch {
  process.exit(0);
}

const notes = [];
for (const file of files) {
  const match = file.match(/^(.+)\.([^.]+)\.md$/);
  if (!match) continue;
  const [, slug, locale] = match;
  if (!locales.includes(locale)) continue;
  const parsed = parseNote(readFileSync(join(NOTES_DIR, file), "utf8"));
  if (!parsed) {
    errors.push({ file, line: 1, message: "no frontmatter block" });
    continue;
  }
  notes.push({ file, slug, locale, ...parsed });
}

const titleBySlugLocale = new Map(
  notes.map((n) => [`${n.slug}:${n.locale}`, n.frontmatter.get("title")]),
);
const knownSlugs = new Set(notes.map((n) => n.slug));

for (const note of notes) {
  const { file, slug, locale, frontmatter, body, offset } = note;
  const at = (line, message) => errors.push({ file, line, message });

  for (const key of FRONTMATTER_REQUIRED) {
    if (!frontmatter.has(key)) at(1, `frontmatter is missing \`${key}\``);
  }
  for (const key of frontmatter.keys()) {
    if (!FRONTMATTER_ALLOWED.has(key)) {
      at(1, `frontmatter key \`${key}\` is not in the collection schema and will be dropped`);
    }
  }
  const date = frontmatter.get("date");
  if (date && !ISO_DATE.test(date)) {
    at(1, `date \`${date}\` is not YYYY-MM-DD`);
  }
  const updated = frontmatter.get("updated");
  if (updated !== undefined && !ISO_DATE.test(updated)) {
    at(1, `updated \`${updated}\` is not YYYY-MM-DD`);
  } else if (updated && ISO_DATE.test(date ?? "") && updated < date) {
    at(1, `updated \`${updated}\` is before date \`${date}\``);
  }
  if (frontmatter.get("draft") !== "true") {
    for (const key of ["title", "description"]) {
      if (frontmatter.has(key) && frontmatter.get(key) === "") {
        at(1, `${key} is empty; fill it in or keep \`draft: true\``);
      }
    }
    if (body.trim() === "") at(1, "body is empty; write it or keep `draft: true`");
  }

  for (const { info, lineNumber } of fenceInfoStrings(body, offset)) {
    if (info === "") {
      at(lineNumber, "code fence has no language");
      continue;
    }
    const [, ...meta] = info.split(/\s+/);
    for (const token of meta) {
      if (!FENCE_META_ALLOWED.test(token)) {
        at(lineNumber, `code fence meta \`${token}\` has no component or CSS behind it`);
      }
    }
  }

  const checked = [
    { line: frontmatter.get("title") ?? "", lineNumber: 1, label: "title" },
    { line: frontmatter.get("description") ?? "", lineNumber: 1, label: "description" },
    ...proseLines(body, offset).map((p) => ({ ...p, label: null })),
  ];

  for (const { line, lineNumber, label } of checked) {
    const where = label ? `${label}: ` : "";
    const text = stripInlineCode(line);

    if (new RegExp(`[${HAN}]_|_[${HAN}]`).test(text)) {
      at(
        lineNumber,
        `${where}underscore emphasis next to a Han character does not parse; use \`**\``,
      );
    }
    if (EMOJI.test(text)) at(lineNumber, `${where}emoji`);
    if (/[“”‘’]/.test(text)) {
      at(lineNumber, `${where}curly quote; use "" in English and 「」 in Chinese`);
    }

    if (locale === "en") {
      if (/[—–]/.test(text)) at(lineNumber, `${where}em or en dash`);
      if (/…/.test(text)) at(lineNumber, `${where}ellipsis character; use three periods`);
      const cjk = text.match(new RegExp(`[${HAN}${CJK_PUNCT}]`));
      if (cjk) at(lineNumber, `${where}untranslated CJK \`${cjk[0]}\``);
    } else {
      for (const run of text.match(/—+/g) ?? []) {
        if (run.length !== 2) at(lineNumber, `${where}破折號 must be exactly ——`);
      }
      for (const run of text.match(/…+/g) ?? []) {
        if (run.length !== 2) at(lineNumber, `${where}刪節號 must be exactly ……`);
      }
    }

    for (const [, alt, target] of text.matchAll(/!\[([^\]]*)\]\(([^)\s]+)\)/g)) {
      if (!alt) at(lineNumber, `image has no alt text`);
      if (/^https?:/.test(target)) {
        at(
          lineNumber,
          `remote image \`${target}\`; put it under public/ or add images.remotePatterns`,
        );
      } else if (!target.startsWith("/")) {
        at(lineNumber, `image \`${target}\` must be an absolute path under public/`);
      }
    }

    for (const [, linkText, target] of text.matchAll(/(?<!!)\[([^\]]*)\]\((\/notes\/[^)\s]+)\)/g)) {
      const targetSlug = target.slice("/notes/".length).replace(/\/$/, "");
      if (!knownSlugs.has(targetSlug)) {
        at(lineNumber, `link to \`${target}\` has no matching note`);
        continue;
      }
      const title = titleBySlugLocale.get(`${targetSlug}:${locale}`);
      const expected = locale === "en" ? `"${title}"` : `「${title}」`;
      if (title && linkText !== expected) {
        at(
          lineNumber,
          `link text ${JSON.stringify(linkText)} should be the cited note's quoted title, ${expected}`,
        );
      }
    }
  }

  if (locale !== "zh-TW") {
    const source = titleBySlugLocale.has(`${slug}:zh-TW`);
    const zh = notes.find((n) => n.slug === slug && n.locale === "zh-TW");
    if (source && zh && zh.frontmatter.get("date") !== date) {
      at(1, `date \`${date}\` does not match zh-TW \`${zh.frontmatter.get("date")}\``);
    }
  }
}

const bySlug = new Map();
for (const { slug, locale } of notes) {
  if (!bySlug.has(slug)) bySlug.set(slug, new Set());
  bySlug.get(slug).add(locale);
}
for (const [slug, present] of bySlug) {
  for (const locale of locales) {
    if (present.has(locale)) continue;
    warnings.push({
      file: `content/notes/${slug}.${locale}.md`,
      line: 1,
      message: `missing; /${locale}/notes/${slug} will serve the fallback locale and be marked noindex`,
    });
  }
}

const annotate = Boolean(process.env.GITHUB_ACTIONS);
const emit = (level, { file, line, message }) => {
  const path = file.startsWith("content/") ? file : `content/notes/${file}`;
  if (annotate) {
    console.error(`::${level} file=${path},line=${line}::${message}`);
  } else {
    console.error(`${level}: ${path}:${line} ${message}`);
  }
};

for (const w of warnings) emit("warning", w);
for (const e of errors) emit("error", e);

if (errors.length > 0) {
  console.error(`\n${errors.length} error(s) in ${notes.length} note file(s).`);
  process.exit(1);
}
if (warnings.length > 0) {
  console.error(`\n${warnings.length} warning(s) in ${notes.length} note file(s).`);
}
