import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { FaqJsonLd } from "@/components/faq-jsonld";
import { buttonVariants } from "@/components/ui/button";
import { assertLocale } from "@/i18n/assert-locale";
import { Link } from "@/i18n/navigation";
import { FAQ } from "@/lib/identity";
import { socialMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

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
  setRequestLocale(locale);

  const t = useTranslations("Faq");
  const items = locale === "zh-TW" ? FAQ.zh : FAQ.en;

  return (
    <section className="relative flex flex-1 flex-col">
      <FaqJsonLd locale={locale} />
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
          {t("description")}
        </p>
        <dl className="mt-10 flex max-w-2xl flex-col gap-8 sm:mt-12 sm:gap-10">
          {items.map((item) => (
            <div key={item.question} className="flex flex-col gap-2">
              <dt className="font-medium text-foreground text-lg leading-snug sm:text-xl">
                {item.question}
              </dt>
              <dd className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
