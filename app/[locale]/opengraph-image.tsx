import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const runtime = "nodejs";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const alt = "Ronald Luo 羅永能";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type Props = {
  params: Promise<{ locale: string }>;
};

const BG = "#141414";
const FG = "#f5f5f5";
const MUTED = "#818181";

const GRID_SQUARE = 6;
const GRID_GAP = 10;
const GRID_MAX_OPACITY = 0.4;
const GRID_SEED = 20260621;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildFlickeringGrid() {
  const cell = GRID_SQUARE + GRID_GAP;
  const cols = Math.ceil(size.width / cell);
  const rows = Math.ceil(size.height / cell);
  const rand = mulberry32(GRID_SEED);
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {[...Array(rows).keys()].map((r) => (
        <div key={r} style={{ display: "flex", flexDirection: "row" }}>
          {[...Array(cols).keys()].map((c) => (
            <div
              key={c}
              style={{
                width: GRID_SQUARE,
                height: GRID_SQUARE,
                marginRight: GRID_GAP,
                marginBottom: GRID_GAP,
                backgroundColor: FG,
                opacity: rand() * GRID_MAX_OPACITY,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

async function loadGoogleFont(family: string, weight: number, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (
    await fetch(url, { headers: { "User-Agent": "node" }, cache: "force-cache" })
  ).text();
  const resource = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:opentype|truetype)'\)/);
  if (!resource) throw new Error(`Failed to resolve font: ${family} ${weight}`);
  const res = await fetch(resource[1], { cache: "force-cache" });
  if (!res.ok) throw new Error(`Failed to fetch font: ${family} ${weight}`);
  return res.arrayBuffer();
}

export default async function Image({ params }: Props) {
  const { locale } = await params;
  const [tEn, tZh] = await Promise.all([
    getTranslations({ locale: "en", namespace: "Home" }),
    getTranslations({ locale: "zh-TW", namespace: "Home" }),
  ]);
  const t = locale === "zh-TW" ? tZh : tEn;

  const name = t("name");
  const title = t("title");
  const company = t("company");

  const unionText = [tEn, tZh].flatMap((m) => [m("name"), m("title"), m("company")]).join("");

  const [geist400, geist600, noto400, noto700, avatar] = await Promise.all([
    loadGoogleFont("Geist", 400, unionText),
    loadGoogleFont("Geist", 600, unionText),
    loadGoogleFont("Noto+Sans+TC", 400, unionText),
    loadGoogleFont("Noto+Sans+TC", 700, unionText),
    readFile(join(process.cwd(), "public/avatar.jpg")),
  ]);

  const avatarSrc = `data:image/jpeg;base64,${avatar.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: BG,
        fontFamily: "Geist",
      }}
    >
      {buildFlickeringGrid()}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage:
            "linear-gradient(90deg, rgba(20,20,20,1) 0%, rgba(20,20,20,0.82) 34%, rgba(20,20,20,0) 74%)",
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 88px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 660 }}>
          <div
            style={{
              display: "flex",
              fontSize: 60,
              fontWeight: 600,
              color: FG,
              lineHeight: 1.1,
              letterSpacing: -1,
            }}
          >
            {name}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", fontSize: 30, color: MUTED }}>{title}</div>
            <div style={{ display: "flex", fontSize: 30, color: MUTED }}>{company}</div>
          </div>
        </div>
        <img
          src={avatarSrc}
          width={320}
          height={320}
          style={{ borderRadius: "50%", objectFit: "cover" }}
          alt={name}
        />
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: geist400, weight: 400, style: "normal" },
        { name: "Geist", data: geist600, weight: 600, style: "normal" },
        { name: "Noto Sans TC", data: noto400, weight: 400, style: "normal" },
        { name: "Noto Sans TC", data: noto700, weight: 700, style: "normal" },
      ],
    },
  );
}
