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
        <div className="container flex w-full flex-1 flex-col items-center justify-center gap-8 py-24 text-center sm:items-start sm:text-left">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <div className="flex flex-col items-center gap-6 sm:items-start">
            <h1 className="max-w-md font-semibold text-3xl text-foreground leading-tight tracking-tight sm:text-4xl">
              {t("title")}
            </h1>
            <p className="max-w-md text-lg text-muted-foreground leading-8">{t("description")}</p>
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
