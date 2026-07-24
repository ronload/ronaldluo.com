import Image from "next/image";
import { useTranslations } from "next-intl";
import { Divider } from "@/components/frame";
import { EXPERIENCES } from "@/lib/identity";

interface ExperienceItem {
  period: string;
  organization: string;
  role: string;
  highlights: string[];
}

export function ExperienceSection() {
  const t = useTranslations("Experience");

  return (
    <section className="relative">
      <Divider />
      <div className="container py-16 sm:py-20">
        <h2 className="font-semibold text-foreground text-xl tracking-tight sm:text-2xl">
          {t("title")}
        </h2>
        <div className="mt-8 flex flex-col gap-10 sm:mt-10 sm:gap-12">
          {Object.entries(EXPERIENCES).map(([key, { icon }]) => {
            const item = t.raw(`items.${key}`) as ExperienceItem;

            return (
              <article key={key} className="flex flex-col gap-2 sm:flex-row sm:gap-8">
                <p className="shrink-0 whitespace-nowrap text-muted-foreground text-sm tabular-nums leading-relaxed sm:w-36 sm:pt-0.5">
                  {item.period}
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Image
                      className="size-10 shrink-0 rounded-lg border border-border object-cover shadow-sm sm:size-11"
                      src={icon}
                      alt={item.organization}
                      width={96}
                      height={96}
                    />
                    <div className="flex flex-col gap-0.5">
                      <h3 className="font-medium text-base text-foreground leading-snug sm:text-lg">
                        {item.organization}
                      </h3>
                      <p className="text-muted-foreground text-sm sm:text-base">{item.role}</p>
                    </div>
                  </div>
                  <ul className="flex flex-col gap-1.5 text-muted-foreground text-sm leading-relaxed sm:text-base">
                    {item.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-[0.5625rem] size-1 shrink-0 rounded-lg bg-muted-foreground/50"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
