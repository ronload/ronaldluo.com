import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { StatusHero, StatusPage } from "@/components/status-page";
import { buttonVariants } from "@/components/ui/button";
import { assertLocale } from "@/i18n/assert-locale";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/identity";
import { canonicalUrl, ogImages, pageUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";

const HREF = "/love";

// Deliberately untranslated: the joke only lands in English, so the copy stays
// out of messages/ instead of forcing a zh-TW entry that would hold English anyway.
const COPY = {
  title: "Girlfriend not found",
  description:
    "The query ran clean and came back with zero rows. No cache, no fallback, no redirect. Applications remain open.",
  backToHome: "Go back home",
  apply: "Apply anyway",
} as const;

// Every locale serves the same English page, so they all collapse onto the
// unprefixed default-locale URL rather than competing as duplicates.
const CANONICAL_LOCALE = routing.defaultLocale;

export const metadata: Metadata = {
  title: COPY.title,
  description: COPY.description,
  alternates: { canonical: canonicalUrl(CANONICAL_LOCALE, HREF) },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: pageUrl(CANONICAL_LOCALE, HREF),
    siteName: SITE_NAME,
    title: COPY.title,
    description: COPY.description,
    images: ogImages(CANONICAL_LOCALE),
  },
  twitter: {
    card: "summary_large_image",
    title: COPY.title,
    description: COPY.description,
  },
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default function Love({ params }: Props) {
  const { locale } = use(params);
  assertLocale(locale);
  setRequestLocale(locale);

  return (
    <StatusPage
      hero={<StatusHero>404</StatusHero>}
      titleAs="h2"
      title={COPY.title}
      description={COPY.description}
      actions={
        <>
          <Link
            href="/"
            className={cn(buttonVariants({ size: "lg" }), "h-12 w-full px-4 text-base")}
          >
            <ArrowLeft />
            {COPY.backToHome}
          </Link>
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 w-full px-4 text-base",
            )}
          >
            {COPY.apply}
            <ArrowRight />
          </Link>
        </>
      }
    />
  );
}
