import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "assets/fonts/NotoSansTC-VF.ttf");
const sourceUrl =
  "https://github.com/notofonts/noto-cjk/raw/main/Sans/Variable/TTF/Subset/NotoSansTC-VF.ttf";
const outDir = join(root, "app/[locale]/fonts");
const charsetFile = join(root, "assets/fonts/.cjk-charset.txt");
const weights = [400, 500, 700];

const scanDirs = ["app", "components", "lib", "i18n", "messages"];
const scanExt = [".ts", ".tsx", ".json", ".mdx", ".md"];

function walk(dir, acc) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "node_modules" || entry === ".next") continue;
      walk(full, acc);
    } else if (scanExt.some((e) => entry.endsWith(e))) {
      acc.push(full);
    }
  }
  return acc;
}

function isCjk(cp) {
  return (
    (cp >= 0x3000 && cp <= 0x303f) ||
    (cp >= 0x3400 && cp <= 0x4dbf) ||
    (cp >= 0x4e00 && cp <= 0x9fff) ||
    (cp >= 0xf900 && cp <= 0xfaff) ||
    (cp >= 0xff00 && cp <= 0xffef)
  );
}

const cjk = new Set();
for (const file of scanDirs.flatMap((d) => walk(join(root, d), []))) {
  for (const ch of readFileSync(file, "utf8")) {
    if (isCjk(ch.codePointAt(0))) cjk.add(ch);
  }
}

const ascii = [];
for (let cp = 0x20; cp <= 0x7e; cp++) ascii.push(String.fromCodePoint(cp));

const chars = [...ascii, ...[...cjk].sort()].join("");
writeFileSync(charsetFile, chars);
console.warn(`charset: ${cjk.size} CJK + ${ascii.length} ASCII = ${[...chars].length} glyphs`);

if (!existsSync(source)) {
  console.warn(`downloading source font -> ${source}`);
  mkdirSync(dirname(source), { recursive: true });
  execFileSync("curl", ["-fsSL", "-o", source, sourceUrl], { stdio: "inherit" });
}
mkdirSync(outDir, { recursive: true });

const uvx = (args) =>
  execFileSync("uvx", ["--from", "fonttools==4.63.0", "--with", "brotli", ...args], {
    stdio: ["ignore", "pipe", "inherit"],
  });

for (const w of weights) {
  const staticTtf = join(root, `assets/fonts/.NotoTC-${w}.ttf`);
  uvx(["fonttools", "varLib.instancer", source, `wght=${w}`, "--static", "-o", staticTtf]);
  const out = join(outDir, `noto-sans-tc-${w}.woff2`);
  uvx([
    "pyftsubset",
    staticTtf,
    `--text-file=${charsetFile}`,
    "--flavor=woff2",
    "--layout-features=ccmp,locl,kern,mark,mkmk",
    "--no-hinting",
    "--desubroutinize",
    `--output-file=${out}`,
  ]);
  console.warn(`weight ${w}: ${statSync(out).size} bytes -> ${out}`);
}
