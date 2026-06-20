import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Divider } from "@/components/frame";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: string }>;
};

type ExperienceItem = {
  period: string;
  organization: string;
  role: string;
  highlights: string[];
};

type EducationItem = {
  period: string;
  organization: string;
  field?: string;
};

const EXPERIENCES = ["prinsur", "kaiyn", "yn"] as const;
const EDUCATION = ["fju", "ckhs"] as const;

export default function Home({ params }: Props) {
  const { locale } = use(params);

  setRequestLocale(locale);

  const t = useTranslations("Home");
  const tExperience = useTranslations("Experience");
  const tEducation = useTranslations("Education");

  return (
    <>
      <section className="relative flex flex-1 flex-col">
        <div className="container flex w-full flex-1 flex-row items-center justify-between gap-6 py-24 text-left sm:gap-12">
          <div className="flex flex-col items-start gap-1.5 sm:gap-3">
            <h1 className="font-semibold text-2xl text-foreground leading-tight tracking-tight sm:text-4xl md:text-5xl">
              {t("name")}
            </h1>
            <div className="flex max-w-md flex-col gap-0.5 text-muted-foreground text-sm leading-relaxed sm:text-base md:text-lg">
              <p>{t("title")}</p>
              <p>{t("company")}</p>
            </div>
          </div>
          <Image
            className="size-24 shrink-0 rounded-full border border-border object-cover shadow-sm invert sm:size-36 md:size-44 dark:invert-0"
            src="/avatar.jpg"
            alt={t("name")}
            width={176}
            height={176}
            priority
          />
        </div>
      </section>

      <section className="relative">
        <Divider />
        <div className="container py-16 sm:py-20">
          <h2 className="font-semibold text-foreground text-xl tracking-tight sm:text-2xl">
            {tExperience("title")}
          </h2>
          <div className="mt-8 flex flex-col gap-10 sm:mt-10 sm:gap-12">
            {EXPERIENCES.map((key) => {
              const item = tExperience.raw(`items.${key}`) as ExperienceItem;

              return (
                <article key={key} className="flex flex-col gap-2 sm:flex-row sm:gap-8">
                  <p className="shrink-0 whitespace-nowrap text-muted-foreground text-sm leading-relaxed tabular-nums sm:w-36 sm:pt-0.5">
                    {item.period}
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-0.5">
                      <h3 className="font-medium text-base text-foreground leading-snug sm:text-lg">
                        {item.organization}
                      </h3>
                      <p className="text-muted-foreground text-sm sm:text-base">{item.role}</p>
                    </div>
                    <ul className="flex flex-col gap-1.5 text-muted-foreground text-sm leading-relaxed sm:text-base">
                      {item.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-2.5">
                          <span
                            aria-hidden="true"
                            className="mt-[0.5625rem] size-1 shrink-0 rounded-full bg-muted-foreground/50"
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

      <section className="relative">
        <Divider />
        <div className="container py-16 sm:py-20">
          <h2 className="font-semibold text-foreground text-xl tracking-tight sm:text-2xl">
            {tEducation("title")}
          </h2>
          <div className="mt-8 flex flex-col gap-10 sm:mt-10 sm:gap-12">
            {EDUCATION.map((key) => {
              const item = tEducation.raw(`items.${key}`) as EducationItem;

              return (
                <article key={key} className="flex flex-col gap-2 sm:flex-row sm:gap-8">
                  <p className="shrink-0 whitespace-nowrap text-muted-foreground text-sm leading-relaxed tabular-nums sm:w-36 sm:pt-0.5">
                    {item.period}
                  </p>
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-medium text-base text-foreground leading-snug sm:text-lg">
                      {item.organization}
                    </h3>
                    {item.field ? (
                      <p className="text-muted-foreground text-sm sm:text-base">{item.field}</p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative">
        <Divider />
        <div className="container flex w-full flex-col items-center py-16 sm:items-start">
          <a
            href="https://github.com/ronload/ronaldluo.com"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 w-full text-base md:w-auto md:min-w-36",
            )}
          >
            <Image
              className="dark:invert"
              src="/github-icon.svg"
              alt="Github icon"
              width={24}
              height={24}
              priority
            />
            {t("github")}
          </a>
        </div>
      </section>

      <footer className="relative py-6 text-center text-muted-foreground text-sm">
        <Divider />
        <div className="container">
          <p>© {new Date().getFullYear()} ronaldluo.com</p>
        </div>
      </footer>
    </>
  );
}
