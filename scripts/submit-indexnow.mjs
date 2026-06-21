import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const SITE_URL = "https://ronaldluo.com";
const HOST = "ronaldluo.com";
const ENDPOINT = "https://api.indexnow.org/indexnow";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");

const keyFile = readdirSync(publicDir).find((file) => {
  if (!file.endsWith(".txt")) return false;
  return readFileSync(join(publicDir, file), "utf8").trim() === file.slice(0, -4);
});

if (!keyFile) {
  console.error("no indexnow key file found in public/");
  process.exit(1);
}

const key = keyFile.slice(0, -4);

const sitemap = await fetch(`${SITE_URL}/sitemap.xml`).then((res) => res.text());
const urlList = [
  ...new Set(
    [...sitemap.matchAll(/(?:<loc>|href=")(https:\/\/[^<"]+)/g)]
      .map((match) => match[1])
      .filter((url) => url.startsWith(SITE_URL)),
  ),
  `${SITE_URL}/llms.txt`,
];

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, urlList }),
});

console.warn(`indexnow: ${res.status} ${res.statusText} (${urlList.length} urls)`);
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}
