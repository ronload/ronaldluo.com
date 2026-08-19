import type { Metadata } from "next";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Divider, FrameHero } from "@/components/frame";
import { assertLocale } from "@/i18n/assert-locale";
import { Link } from "@/i18n/navigation";
import { FEED_ALTERNATES, socialMetadata } from "@/lib/seo";
import { source } from "@/lib/source";

interface Props {
  params: Promise<{ locale: string }>;
}

const includeDrafts = process.env.NODE_ENV !== "production";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);
  const t = await getTranslations({ locale, namespace: "Notes" });
  const social = socialMetadata({
    locale,
    path: "/notes",
    title: t("title"),
    description: t("description"),
  });

  return {
    title: t("title"),
    ...social,
    alternates: { ...social.alternates, types: FEED_ALTERNATES },
  };
}

export default async function NotesPage({ params }: Props) {
  const { locale } = await params;
  assertLocale(locale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Notes" });
  const format = await getFormatter({ locale });
  const notes = source
    .getPages(locale)
    .filter((note) => includeDrafts || !note.data.draft)
    .sort((a, b) => b.data.date.localeCompare(a.data.date));

  return (
    <>
      <FrameHero>
        <div className="flex w-4/5 flex-col gap-4 text-center">
          <h1 className="font-semibold text-3xl text-foreground leading-tight tracking-tight sm:text-4xl">
            {t("title")}
          </h1>
          <p className="wrap-break-word break-keep text-lg text-muted-foreground leading-8">
            {t("description")}
          </p>
        </div>
      </FrameHero>
      <section className="relative z-0 bg-background">
        <Divider />
        <div className="container flex w-full justify-center py-12 sm:py-16">
          {notes.length === 0 ? (
            <p className="w-4/5 text-center text-muted-foreground">{t("empty")}</p>
          ) : (
            <ul className="flex w-4/5 flex-col">
              {notes.map((note) => (
                <li className="border-b last:border-b-0" key={note.url}>
                  <Link className="group flex flex-col gap-1 py-6" href={`/notes/${note.slugs[0]}`}>
                    <time
                      className="font-mono text-muted-foreground text-xs"
                      dateTime={note.data.date}
                    >
                      {format.dateTime(new Date(note.data.date), { dateStyle: "long" })}
                    </time>
                    <h2 className="font-medium text-lg leading-snug transition-colors group-hover:text-muted-foreground sm:text-xl">
                      {note.data.title}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                      {note.data.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
