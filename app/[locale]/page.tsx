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

export default function Home({ params }: Props) {
  const { locale } = use(params);

  setRequestLocale(locale);

  const t = useTranslations("Home");

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
