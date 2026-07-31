import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { CommandMenuLabels } from "@/components/command-menu";
import { FrameGuides, PageFrame } from "@/components/frame";
import { RelMeLinks } from "@/components/rel-me-links";
import { SiteHeader } from "@/components/site-header";
import { ThemeColor } from "@/components/theme-color";
import { ThemeProvider } from "@/components/theme-provider";
import { assertLocale } from "@/i18n/assert-locale";
import { routing } from "@/i18n/routing";
import { ACTIVE_CHANNELS } from "@/lib/contact-channels";
import { SITE_URL } from "@/lib/identity";
import { FEED_ALTERNATES, socialMetadata } from "@/lib/seo";
import { source } from "@/lib/source";
import { providerThemes } from "@/lib/theme-registry";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

const includeDrafts = process.env.NODE_ENV !== "production";

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
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
  const [command, header, contact, faq, forLlms] = await Promise.all([
    getTranslations({ locale, namespace: "CommandMenu" }),
    getTranslations({ locale, namespace: "Header" }),
    getTranslations({ locale, namespace: "Contact" }),
    getTranslations({ locale, namespace: "Faq" }),
    getTranslations({ locale, namespace: "ForLlms" }),
  ]);
  const commandLabels: CommandMenuLabels = {
    close: command("close"),
    contact: contact("title"),
    contacts: command("contacts"),
    description: command("description"),
    empty: command("empty"),
    faq: faq("title"),
    forLlms: forLlms("title"),
    home: header("home"),
    navigate: command("navigate"),
    navigation: command("navigation"),
    notes: header("notes"),
    placeholder: command("placeholder"),
    select: command("select"),
    settings: command("settings"),
    switchLanguage: command("switchLanguage"),
    themes: command("themes"),
    title: command("title"),
    trigger: command("trigger"),
  };
  const commandNotes = source
    .getPages(locale)
    .filter((note) => includeDrafts || !note.data.draft)
    .sort((a, b) => b.data.date.localeCompare(a.data.date))
    .map((note) => ({
      slug: note.slugs[0],
      title: note.data.title,
      description: note.data.description,
    }));
  const commandContacts = ACTIVE_CHANNELS.map(({ href, label }) => ({ href, label }));

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[110] focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:focus-visible:ring-2 focus:focus-visible:ring-ring"
          href="#main-content"
        >
          {command("skipToContent")}
        </a>
        <RelMeLinks />
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="tokyonight-night"
          enableSystem
          enableColorScheme={false}
          disableTransitionOnChange
          themes={providerThemes}
        >
          <ThemeColor />
          <NextIntlClientProvider messages={{}}>
            <PageFrame>
              <SiteHeader
                commandMenu={{
                  contacts: commandContacts,
                  labels: commandLabels,
                  notes: commandNotes,
                }}
              />
              <main className="relative z-0 flex flex-1 flex-col" id="main-content" tabIndex={-1}>
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
