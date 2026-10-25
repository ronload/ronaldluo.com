import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { use } from "react";
import { BackLink } from "@/components/back-link";
import { FaqJsonLd } from "@/components/faq-jsonld";
import { assertLocale } from "@/i18n/assert-locale";
import { FAQ } from "@/lib/identity";
import { socialMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);
  const t = await getTranslations({ locale, namespace: "Faq" });

  return {
    title: t("title"),
    ...socialMetadata({
      locale,
      path: "/faq",
      title: t("title"),
      description: t("description"),
    }),
  };
}

export default function Faq({ params }: Props) {
  const { locale } = use(params);
  assertLocale(locale);

  const t = useTranslations("Faq");
  const items = locale === "zh-TW" ? FAQ.zh : FAQ.en;

  return (
    <section className="relative flex flex-1 flex-col">
      <FaqJsonLd locale={locale} />
      <BackLink href="/" label={t("backToHome")} />
      <div className="container py-12 sm:py-16">
        <h1 className="text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {t("description")}
        </p>
        <dl className="mt-10 flex max-w-2xl flex-col gap-8 sm:mt-12 sm:gap-10">
          {items.map((item) => (
            <div key={item.question} className="flex flex-col gap-2">
              <dt className="text-lg leading-snug font-medium text-foreground sm:text-xl">
                {item.question}
              </dt>
              <dd className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
