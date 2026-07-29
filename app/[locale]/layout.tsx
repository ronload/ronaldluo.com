import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FrameGuides, PageFrame } from "@/components/frame";
import { RelMeLinks } from "@/components/rel-me-links";
import { SiteHeader } from "@/components/site-header";
import { ThemeColor } from "@/components/theme-color";
import { ThemeProvider } from "@/components/theme-provider";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/identity";
import { FEED_ALTERNATES, socialMetadata } from "@/lib/seo";
import { providerThemes } from "@/lib/theme-registry";
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

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e1e2e7" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1b26" },
  ],
};

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
  const social = socialMetadata({
    locale,
    path: "/",
    title: t("title"),
    description: t("description"),
  });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: "%s | Ronald Luo 羅永能",
    },
    ...social,
    alternates: { ...social.alternates, types: FEED_ALTERNATES },
    robots: {
      googleBot: {
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <RelMeLinks />
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          enableColorScheme={false}
          disableTransitionOnChange
          themes={providerThemes}
        >
          <ThemeColor />
          <NextIntlClientProvider messages={{}}>
            <PageFrame>
              <SiteHeader />
              <main className="relative z-0 flex flex-1 flex-col">
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
