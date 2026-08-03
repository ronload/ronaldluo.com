import Image from "next/image";
import { useMessages, useTranslations } from "next-intl";
import { Divider } from "@/components/frame";
import { SCHOOLS } from "@/lib/identity";
import { cn, externalLinkProps, objectKeys } from "@/lib/utils";

export function EducationSection() {
  const t = useTranslations("Education");
  const { Education } = useMessages();

  return (
    <section className="relative">
      <Divider />
      <div className="container py-16 sm:py-20">
        <h2 className="home-reveal home-reveal--after-title font-semibold text-foreground text-xl tracking-tight sm:text-2xl">
          {t("title")}
        </h2>
        <div className="home-reveal-group home-reveal-group--later mt-8 flex flex-col gap-10 sm:mt-10 sm:gap-12">
          {objectKeys(SCHOOLS).map((key) => {
            const school = SCHOOLS[key];
            const item = Education.items[key];

            return (
              <article key={key} className="flex flex-col gap-2 sm:flex-row sm:gap-8">
                <p className="shrink-0 whitespace-nowrap text-muted-foreground text-sm tabular-nums leading-relaxed sm:w-36 sm:pt-0.5">
                  {item.period}
                </p>
                <a
                  className="group flex items-start gap-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                  href={school.url}
                  {...externalLinkProps(school.url)}
                >
                  <Image
                    className={cn(
                      "size-10 shrink-0 border border-border object-cover shadow-sm sm:size-11",
                      school.brightIcon && "bg-card",
                    )}
                    src={school.icon}
                    alt=""
                    width={96}
                    height={96}
                  />
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-medium text-base text-foreground leading-snug underline-offset-4 group-hover:underline group-focus-visible:underline sm:text-lg">
                      {item.organization}
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base">{item.field}</p>
                  </div>
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
