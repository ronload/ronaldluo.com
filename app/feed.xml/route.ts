import { routing } from "@/i18n/routing";
import { buildAtomFeed, feedResponse } from "@/lib/feed";

export const dynamic = "force-static";

export async function GET() {
  return feedResponse(await buildAtomFeed(routing.defaultLocale));
}
