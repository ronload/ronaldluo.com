import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/identity";

export const runtime = "nodejs";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const alt = SITE_NAME;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

interface Props {
  params: Promise<{ locale: string }>;
}

const BG = "#141414";
const FG = "#f5f5f5";
const MUTED = "#818181";
const FRAME_LINE = "rgba(245, 245, 245, 0.08)";
const FRAME_TEXTURE = "rgba(245, 245, 245, 0.04)";
const FRAME_INSET = 104;
const FRAME_TOP = 72;
const FRAME_BOTTOM = size.height - FRAME_TOP;
const DOT_SIZE = 8;
const CONTENT_INSET = FRAME_INSET + 48;

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
      <div
        style={{
          position: "absolute",
          top: FRAME_TOP,
          right: FRAME_INSET,
          bottom: size.height - FRAME_BOTTOM,
          left: FRAME_INSET,
          backgroundColor: BG,
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, ${FRAME_TEXTURE} 2px, ${FRAME_TEXTURE} 4px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: FRAME_INSET - 0.5,
          width: 1,
          backgroundColor: FRAME_LINE,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: FRAME_INSET - 0.5,
          bottom: 0,
          width: 1,
          backgroundColor: FRAME_LINE,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: FRAME_TOP - 0.5,
          left: 0,
          width: "100%",
          height: 1,
          backgroundColor: FRAME_LINE,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: FRAME_BOTTOM - 0.5,
          left: 0,
          width: "100%",
          height: 1,
          backgroundColor: FRAME_LINE,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: FRAME_TOP - DOT_SIZE / 2,
          left: FRAME_INSET - DOT_SIZE / 2,
          width: DOT_SIZE,
          height: DOT_SIZE,
          border: `1px solid ${FRAME_LINE}`,
          backgroundColor: BG,
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.32)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: FRAME_TOP - DOT_SIZE / 2,
          right: FRAME_INSET - DOT_SIZE / 2,
          width: DOT_SIZE,
          height: DOT_SIZE,
          border: `1px solid ${FRAME_LINE}`,
          backgroundColor: BG,
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.32)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: FRAME_BOTTOM - DOT_SIZE / 2,
          left: FRAME_INSET - DOT_SIZE / 2,
          width: DOT_SIZE,
          height: DOT_SIZE,
          border: `1px solid ${FRAME_LINE}`,
          backgroundColor: BG,
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.32)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: FRAME_BOTTOM - DOT_SIZE / 2,
          right: FRAME_INSET - DOT_SIZE / 2,
          width: DOT_SIZE,
          height: DOT_SIZE,
          border: `1px solid ${FRAME_LINE}`,
          backgroundColor: BG,
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.32)",
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
          padding: `0 ${CONTENT_INSET}px`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 540 }}>
          <div
            style={{
              display: "flex",
              fontSize: 48,
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
        <img src={avatarSrc} width={280} height={280} style={{ objectFit: "cover" }} alt={name} />
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
