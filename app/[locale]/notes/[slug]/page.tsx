import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { BackLink } from "@/components/back-link";
import { FrameAside } from "@/components/frame";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { NoteToc } from "@/components/mdx/note-toc";
import { NoteJsonLd } from "@/components/note-jsonld";
import { assertLocale } from "@/i18n/assert-locale";
import { noteMetadata, pageUrl, withInheritedOpenGraphImages } from "@/lib/seo";
import { isFallbackNote, noteLocales, source } from "@/lib/source";
import { NoteNav } from "../_components/note-nav";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

const includeDrafts = process.env.NODE_ENV !== "production";

function getNote(locale: string, slug: string) {
  const note = source.getPage([slug], locale);
  if (!note || (note.data.draft && !includeDrafts)) notFound();

  return note;
}

export function generateStaticParams() {
  return source
    .generateParams("slug", "locale")
    .filter((param) => param.slug.length === 1)
    .map((param) => ({ locale: param.locale, slug: param.slug[0] }))
    .filter(({ locale, slug }) => {
      const note = source.getPage([slug], locale);
      return note !== undefined && (includeDrafts || !note.data.draft);
    });
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { locale, slug } = await params;
  assertLocale(locale);
  const note = getNote(locale, slug);

  return withInheritedOpenGraphImages(
    noteMetadata({
      locale,
      slug,
      title: note.data.title,
      description: note.data.description,
      date: note.data.date,
      modified: note.data.updated,
      locales: noteLocales(slug),
      fallback: isFallbackNote(note, locale),
    }),
    parent,
  );
}

export default async function NotePage({ params }: Props) {
  const { locale, slug } = await params;
  assertLocale(locale);
  setRequestLocale(locale);

  const note = getNote(locale, slug);
  const t = await getTranslations({ locale, namespace: "Notes" });
  const format = await getFormatter({ locale });
  const fallback = isFallbackNote(note, locale);
  const toc = note.data.toc.filter((item) => item.depth <= 4);
  const MDX = note.data.body;

  return (
    <section className="relative flex flex-1 flex-col">
      {fallback ? null : (
        <NoteJsonLd
          date={note.data.date}
          description={note.data.description}
          keywords={note.data.tags}
          locale={locale}
          modified={note.data.updated}
          title={note.data.title}
          url={pageUrl(locale, `/notes/${slug}`)}
        />
      )}
      <BackLink href="/notes" label={t("backToNotes")} />
      <div className="container pt-6 pb-20">
        <article>
          <header>
            <h1 className="font-semibold text-3xl leading-tight tracking-tight sm:text-4xl">
              {note.data.title}
            </h1>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed sm:text-lg">
              {note.data.description}
            </p>
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-sm">
              <time dateTime={note.data.date}>
                {format.dateTime(new Date(note.data.date), { dateStyle: "long" })}
              </time>
              {note.data.updated ? (
                <span>
                  {t("updated", {
                    date: format.dateTime(new Date(note.data.updated), { dateStyle: "long" }),
                  })}
                </span>
              ) : null}
            </p>
          </header>
          {fallback ? (
            <p className="mt-8 border border-warning/40 bg-warning/8 px-4 py-3 text-sm text-warning-foreground">
              {t("fallbackNotice")}
            </p>
          ) : null}
          <div className="note-prose mt-10">
            <MDX components={mdxComponents({ copy: t("copyCode"), copied: t("copiedCode") })} />
          </div>
        </article>
      </div>
      <FrameAside side="start">
        <NoteNav locale={locale} slug={slug} />
      </FrameAside>
      {toc.length === 0 ? null : (
        <FrameAside>
          <NoteToc items={toc} label={t("toc")} />
        </FrameAside>
      )}
    </section>
  );
}
