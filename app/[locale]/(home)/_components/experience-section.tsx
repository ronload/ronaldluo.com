import Image from "next/image";
import { useMessages, useTranslations } from "next-intl";
import { Divider } from "@/components/frame";
import { EXPERIENCES } from "@/lib/identity";
import { externalLinkProps, objectKeys } from "@/lib/utils";

export function ExperienceSection() {
  const t = useTranslations("Experience");
  const { Experience } = useMessages();

  return (
    <section className="relative">
      <Divider />
      <div className="container py-16 sm:py-20">
        <h2 className="home-reveal home-reveal--after-title font-semibold text-foreground text-xl tracking-tight sm:text-2xl">
          {t("title")}
        </h2>
        <div className="home-reveal-group home-reveal-group--later mt-8 flex flex-col gap-10 sm:mt-10 sm:gap-12">
          {objectKeys(EXPERIENCES).map((key) => {
            const { icon, url } = EXPERIENCES[key];
            const item = Experience.items[key];

            return (
              <article key={key} className="flex flex-col gap-2 sm:flex-row sm:gap-8">
                <p className="shrink-0 whitespace-nowrap text-muted-foreground text-sm tabular-nums leading-relaxed sm:w-36 sm:pt-0.5">
                  {item.period}
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    className="group flex w-fit items-center gap-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                    href={url}
                    {...externalLinkProps(url)}
                  >
                    <Image
                      className="size-10 shrink-0 border border-border object-cover shadow-sm sm:size-11"
                      src={icon}
                      alt=""
                      width={96}
                      height={96}
                    />
                    <div className="flex flex-col gap-0.5">
                      <h3 className="font-medium text-base text-foreground leading-snug underline-offset-4 group-hover:underline group-focus-visible:underline sm:text-lg">
                        {item.organization}
                      </h3>
                      <p className="text-muted-foreground text-sm sm:text-base">{item.role}</p>
                    </div>
                  </a>
                  <ul className="flex flex-col gap-1.5 text-muted-foreground text-sm leading-relaxed sm:text-base">
                    {item.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-[0.5625rem] size-1 shrink-0 bg-muted-foreground/50"
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
