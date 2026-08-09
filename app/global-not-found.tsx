import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { hasLocale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { FrameGuides, PageFrame } from "@/components/frame";
import { StatusPage } from "@/components/status-page";
import { ThemeColor } from "@/components/theme-color";
import { ThemeProvider } from "@/components/theme-provider";
import { buttonVariants } from "@/components/ui/button";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { formatTitle } from "@/lib/seo";
import { providerThemes } from "@/lib/theme-registry";
import { cn } from "@/lib/utils";
import "./globals.css";

const resolveLocale = async () => {
  const locale = await getLocale();
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1b26" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const t = await getTranslations({ locale, namespace: "NotFound" });

  return {
    title: formatTitle(t("title")),
    description: t("description"),
  };
}

export default async function GlobalNotFound() {
  const locale = await resolveLocale();
  const t = await getTranslations({ locale, namespace: "NotFound" });

  return (
    <html lang={locale} className={`${fontVariables} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="tokyonight-night"
          enableSystem
          enableColorScheme={false}
          disableTransitionOnChange
          themes={providerThemes}
        >
          <ThemeColor />
          <PageFrame>
            <main className="relative z-0 flex flex-1 flex-col">
              <FrameGuides />
              <StatusPage
                hero={
                  <h1 className="bg-gradient-to-b from-foreground via-foreground to-muted-foreground bg-clip-text font-bold font-mono text-[120px] text-transparent leading-none tracking-tighter sm:text-[180px] md:text-[220px]">
                    404
                  </h1>
                }
                titleAs="h2"
                title={t("title")}
                description={t("description")}
                actions={
                  <>
                    <Link
                      href={getPathname({ locale, href: "/" })}
                      className={cn(buttonVariants({ size: "lg" }), "h-12 w-full px-4 text-base")}
                    >
                      <ArrowLeft />
                      {t("backToHome")}
                    </Link>
                    <Link
                      href={getPathname({ locale, href: "/contact" })}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "h-12 w-full px-4 text-base",
                      )}
                    >
                      {t("contact")}
                      <ArrowRight />
                    </Link>
                  </>
                }
              />
            </main>
          </PageFrame>
        </ThemeProvider>
      </body>
    </html>
  );
}
