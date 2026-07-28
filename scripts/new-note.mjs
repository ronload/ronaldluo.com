import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const TIME_ZONE = "Asia/Taipei";
const SOURCE_LOCALE = "zh-TW";
const TRANSLATION_LOCALE = "en";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const notesDir = join(root, "content", "notes");

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

function usage() {
  console.error('usage: pnpm new-note "<English title>" ["<中文標題>"] [--en]');
  process.exit(1);
}

function slugify(title) {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function today() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type) => parts.find((part) => part.type === type).value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function frontmatter(title, date) {
  return `---\ntitle: ${title}\ndescription:\ndate: ${date}\ndraft: true\n---\n`;
}

const args = process.argv.slice(2);
const withTranslation = args.includes(`--${TRANSLATION_LOCALE}`);
const positional = args.filter((arg) => !arg.startsWith("--"));

if (positional.length === 0 || positional.length > 2) usage();

const [englishTitle, localTitle] = positional;
const slug = slugify(englishTitle);

if (!slug) {
  fail(`cannot derive an ASCII slug from ${JSON.stringify(englishTitle)}; pass the English title`);
}

const existing = readdirSync(notesDir).filter((file) => file.startsWith(`${slug}.`));
if (existing.length > 0) {
  fail(`slug \`${slug}\` is taken by ${existing.join(", ")}`);
}

const date = today();
const created = [];

const files = [
  { locale: SOURCE_LOCALE, title: localTitle ? `${englishTitle}｜${localTitle}` : englishTitle },
  ...(withTranslation ? [{ locale: TRANSLATION_LOCALE, title: englishTitle }] : []),
];

for (const { locale, title } of files) {
  const path = join(notesDir, `${slug}.${locale}.md`);
  if (existsSync(path)) fail(`${path} already exists`);
  writeFileSync(path, frontmatter(title, date), "utf8");
  created.push(`content/notes/${slug}.${locale}.md`);
}

for (const path of created) console.warn(`created ${path}`);
console.warn(`\nslug \`${slug}\`, dated ${date}, drafted.`);
console.warn("fill in description, write the body, then set draft to false to publish.");
if (!withTranslation) {
  console.warn(
    `no ${TRANSLATION_LOCALE} file: /${TRANSLATION_LOCALE === "en" ? "" : `${TRANSLATION_LOCALE}/`}notes/${slug} will serve the ${SOURCE_LOCALE} body behind a fallback notice.`,
  );
}
