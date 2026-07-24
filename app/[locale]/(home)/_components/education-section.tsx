import Image from "next/image";
import { useTranslations } from "next-intl";
import { Divider } from "@/components/frame";
import { SCHOOLS } from "@/lib/identity";
import { cn } from "@/lib/utils";

interface EducationItem {
  period: string;
  organization: string;
  field?: string;
}

export function EducationSection() {
  const t = useTranslations("Education");

  return (
    <section className="relative">
      <Divider />
      <div className="container py-16 sm:py-20">
        <h2 className="font-semibold text-foreground text-xl tracking-tight sm:text-2xl">
          {t("title")}
        </h2>
        <div className="mt-8 flex flex-col gap-10 sm:mt-10 sm:gap-12">
          {Object.entries(SCHOOLS).map(([key, school]) => {
            const item = t.raw(`items.${key}`) as EducationItem;

            return (
              <article key={key} className="flex flex-col gap-2 sm:flex-row sm:gap-8">
                <p className="shrink-0 whitespace-nowrap text-muted-foreground text-sm tabular-nums leading-relaxed sm:w-36 sm:pt-0.5">
                  {item.period}
                </p>
                <div className="flex items-start gap-3">
                  <Image
                    className={cn(
                      "size-10 shrink-0 rounded-lg border border-border object-cover shadow-sm sm:size-11",
                      school.brightIcon && "bg-white",
                    )}
                    src={school.icon}
                    alt={item.organization}
                    width={96}
                    height={96}
                  />
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-medium text-base text-foreground leading-snug sm:text-lg">
                      {item.organization}
                    </h3>
                    {item.field ? (
                      <p className="text-muted-foreground text-sm sm:text-base">{item.field}</p>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
