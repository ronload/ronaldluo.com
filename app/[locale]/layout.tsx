import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FrameGuides, FrameTexture, PageFrame } from "@/components/frame";
import { RelMeLinks } from "@/components/rel-me-links";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/identity";
import { socialMetadata } from "@/lib/seo";
import "../globals.css";
import { assertLocale } from "@/i18n/assert-locale";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

const notoSansTC = localFont({
  variable: "--font-noto-sans-tc",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["PingFang TC", "Microsoft JhengHei", "Heiti TC", "sans-serif"],
  src: [
    { path: "./fonts/noto-sans-tc-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/noto-sans-tc-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/noto-sans-tc-700.woff2", weight: "700", style: "normal" },
  ],
});

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: "%s | Ronald Luo 羅永能",
    },
    ...socialMetadata({
      locale,
      path: "/",
      title: t("title"),
      description: t("description"),
    }),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  assertLocale(locale);
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansTC.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <RelMeLinks />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={{}}>
            <PageFrame>
              <SiteHeader />
              <main className="relative z-0 flex flex-1 flex-col">
                <FrameTexture />
                <FrameGuides />
                {children}
              </main>
            </PageFrame>
          </NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
