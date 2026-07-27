import { assertLocale } from "@/i18n/assert-locale";
import { routing } from "@/i18n/routing";
import { buildAtomFeed, feedResponse } from "@/lib/feed";

export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  assertLocale(locale);

  return feedResponse(await buildAtomFeed(locale));
}
