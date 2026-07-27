import { Library } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { source } from "@/lib/source";
import { cn } from "@/lib/utils";

const includeDrafts = process.env.NODE_ENV !== "production";

interface Props {
  locale: Locale;
  slug: string;
}

export async function NoteNav({ locale, slug }: Props) {
  const t = await getTranslations({ locale, namespace: "Notes" });
  const notes = source
    .getPages(locale)
    .filter((note) => includeDrafts || !note.data.draft)
    .sort((a, b) => b.data.date.localeCompare(a.data.date));

  if (notes.length === 0) return null;

  return (
    <nav aria-labelledby="note-nav-label" className="flex max-h-[calc(100svh_-_8rem)] flex-col">
      <p
        className="inline-flex items-center gap-1.5 text-muted-foreground text-sm"
        id="note-nav-label"
      >
        <Library className="size-4 shrink-0" />
        {t("title")}
      </p>
      <div className="min-h-0 overflow-y-auto overflow-x-clip py-3 [mask-image:linear-gradient(to_bottom,transparent,white_16px,white_calc(100%_-_16px),transparent)] [scrollbar-width:none]">
        <ul className="flex flex-col border-s">
          {notes.map((note) => {
            const active = note.slugs[0] === slug;

            return (
              <li key={note.url}>
                <Link
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "wrap-anywhere relative block py-1.5 ps-3 text-sm leading-relaxed transition-colors",
                    active
                      ? "text-primary before:absolute before:inset-y-0 before:-start-px before:w-px before:bg-primary"
                      : "text-muted-foreground hover:text-accent-foreground",
                  )}
                  href={`/notes/${note.slugs[0]}`}
                >
                  {note.data.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
