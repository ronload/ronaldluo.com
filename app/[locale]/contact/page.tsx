import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { GradientButton } from "@/components/gradient-button";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { CONTACT_CHANNELS } from "@/lib/contact-channels";
import { socialMetadata } from "@/lib/seo";
import { cn, externalLinkProps } from "@/lib/utils";

interface Props {
  params: Promise<{ locale: string }>;
}

function BackToHome({ label }: { label: string }) {
  return (
    <Link
      href="/"
      className={cn(
        buttonVariants({ variant: "link", size: "sm" }),
        "-ms-3 gap-2 text-muted-foreground transition-colors hover:text-foreground",
      )}
    >
      <ArrowLeft />
      {label}
    </Link>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "Contact" });

  return {
    title: t("title"),
    ...socialMetadata({
      locale,
      path: "/contact",
      title: t("title"),
      description: t("description"),
    }),
  };
}

export default function Contact({ params }: Props) {
  const { locale } = use(params);

  setRequestLocale(locale);

  const t = useTranslations("Contact");

  return (
    <section className="relative flex flex-1 flex-col">
      <div className="container pt-6">
        <BackToHome label={t("backToHome")} />
      </div>
      <div className="container flex w-full flex-1 flex-col items-center justify-center gap-10 py-24">
        <div className="flex w-4/5 flex-col gap-4 text-center">
          <h1 className="font-semibold text-3xl text-foreground leading-tight tracking-tight sm:text-4xl">
            {t("title")}
          </h1>
          <p className="text-lg text-muted-foreground leading-8">{t("description")}</p>
        </div>
        <nav className="grid w-4/5 grid-cols-1 gap-4 md:grid-flow-col md:grid-cols-2 md:grid-rows-4">
          {CONTACT_CHANNELS.map(({ label, href, icon: Icon, note }) => (
            <GradientButton
              key={label}
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<a href={href} {...externalLinkProps(href)} />}
              className="h-12 w-full justify-start gap-3 bg-transparent px-4 text-base"
            >
              <Icon className="size-5" />
              <span>
                {label}
                {note ? (
                  <span className="ml-1.5 font-normal text-muted-foreground">{note}</span>
                ) : null}
              </span>
            </GradientButton>
          ))}
        </nav>
      </div>
    </section>
  );
}
