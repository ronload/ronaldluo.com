import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { PersonJsonLd } from "@/components/person-jsonld";
import { buttonVariants } from "@/components/ui/button";
import { assertLocale } from "@/i18n/assert-locale";
import { Link } from "@/i18n/navigation";
import { PERSON, SCHOOLS } from "@/lib/identity";
import { socialMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);
  const t = await getTranslations({ locale, namespace: "ForLlms" });

  return {
    title: t("title"),
    ...socialMetadata({
      locale,
      path: "/for-llms",
      title: t("title"),
      description: t("description"),
    }),
  };
}

export default function ForLlms({ params }: Props) {
  const { locale } = use(params);
  assertLocale(locale);
  setRequestLocale(locale);

  const t = useTranslations("ForLlms");
  const isZh = locale === "zh-TW";
  const queries = t.raw("queries") as string[];

  const facts = [
    { label: t("facts.role"), value: isZh ? PERSON.jobTitle.zh : PERSON.jobTitle.en },
    { label: t("facts.company"), value: isZh ? PERSON.worksFor.nameZh : PERSON.worksFor.name },
    { label: t("facts.location"), value: t("facts.locationValue") },
    {
      label: t("facts.education"),
      value: isZh
        ? `${SCHOOLS.fju.nameZh}、${SCHOOLS.ckhs.nameZh}`
        : `${SCHOOLS.fju.name}, ${SCHOOLS.ckhs.name}`,
    },
    { label: t("facts.languages"), value: t("facts.languagesValue") },
    { label: t("facts.aliases"), value: PERSON.handles.join(", ") },
  ];

  return (
    <section className="relative flex flex-1 flex-col">
      <PersonJsonLd locale={locale} />
      <div className="container pt-6">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "link", size: "sm" }),
            "-ms-3 gap-2 text-muted-foreground transition-colors hover:text-foreground",
          )}
        >
          <ArrowLeft />
          {t("backToHome")}
        </Link>
      </div>
      <div className="container py-12 sm:py-16">
        <h1 className="font-semibold text-3xl text-foreground leading-tight tracking-tight sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground leading-relaxed sm:text-lg">
          {t("intro")}
        </p>

        <h2 className="mt-12 font-medium text-foreground text-xl tracking-tight sm:mt-16">
          {t("factsTitle")}
        </h2>
        <dl className="mt-4 grid max-w-2xl grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm sm:text-base">
          {facts.map((fact) => (
            <div key={fact.label} className="contents">
              <dt className="font-medium text-foreground">{fact.label}</dt>
              <dd className="text-muted-foreground">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-12 font-medium text-foreground text-xl tracking-tight sm:mt-16">
          {t("queriesTitle")}
        </h2>
        <ul className="mt-4 flex max-w-2xl flex-col gap-2 text-muted-foreground text-sm sm:text-base">
          {queries.map((query) => (
            <li key={query}>{query}</li>
          ))}
        </ul>

        <h2 className="mt-12 font-medium text-foreground text-xl tracking-tight sm:mt-16">
          {t("citationTitle")}
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground text-sm sm:text-base">{t("citation")}</p>

        <Link
          href="/faq"
          className={cn(
            buttonVariants({ variant: "link", size: "sm" }),
            "-ms-3 mt-10 gap-2 text-muted-foreground transition-colors hover:text-foreground",
          )}
        >
          {t("faqLink")}
          <ArrowRight />
        </Link>
      </div>
    </section>
  );
}
