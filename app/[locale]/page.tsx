import { Mail, Send } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Divider } from "@/components/frame";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
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

const EXPERIENCE_ICONS: Record<(typeof EXPERIENCES)[number], string> = {
  prinsur: "/prinsur-icon.png",
  kaiyn: "/kaiyn-capital-icon.jpg",
  yn: "/yn-official-icon.jpg",
};

const EDUCATION_ICONS: Record<(typeof EDUCATION)[number], string> = {
  fju: "/fju-icon.jpg",
  ckhs: "/ckhs-icon.png",
};

export default function Home({ params }: Props) {
  const { locale } = use(params);

  setRequestLocale(locale);

  const t = useTranslations("Home");
  const tExperience = useTranslations("Experience");
  const tEducation = useTranslations("Education");

  return (
    <>
      <section className="relative flex flex-1 flex-col">
        <div className="container flex w-full flex-1 flex-col justify-center py-12 sm:py-24">
          <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-8 text-left sm:gap-x-12 sm:gap-y-10">
            <div className="col-start-1 row-start-1 flex flex-col items-start gap-1.5 self-center sm:gap-3 sm:self-start">
              <h1 className="font-semibold text-2xl text-foreground leading-tight tracking-tight sm:text-4xl md:text-5xl">
                {t("name")}
              </h1>
              <div className="flex max-w-md flex-col gap-0.5 text-muted-foreground text-sm leading-relaxed sm:text-base md:text-lg">
                <p>{t("title")}</p>
                <p>{t("company")}</p>
              </div>
            </div>
            <Image
              className="col-start-2 row-start-1 aspect-square size-24 self-center rounded-full border border-border object-cover shadow-sm invert sm:row-span-2 sm:h-full sm:w-auto sm:self-stretch dark:invert-0"
              src="/avatar.jpg"
              alt={t("name")}
              width={176}
              height={176}
              priority
            />
            <div className="col-span-2 row-start-2 flex gap-3 sm:col-span-1 sm:col-start-1 sm:gap-4">
              <a
                href="mailto:ronald@ronaldluo.com"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 flex-1 text-base sm:flex-none sm:min-w-44",
                )}
              >
                <Mail />
                {t("email")}
              </a>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 flex-1 text-base sm:flex-none sm:min-w-44",
                )}
              >
                <Send />
                {t("contact")}
              </Link>
            </div>
          </div>
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
                    <div className="flex items-center gap-3">
                      <Image
                        className="size-10 shrink-0 rounded-lg border border-border object-cover shadow-sm sm:size-11"
                        src={EXPERIENCE_ICONS[key]}
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
                  <div className="flex items-center gap-3">
                    <Image
                      className={cn(
                        "size-10 shrink-0 rounded-lg border border-border object-cover shadow-sm sm:size-11",
                        key === "ckhs" && "bg-white",
                      )}
                      src={EDUCATION_ICONS[key]}
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
