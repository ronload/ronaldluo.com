import { NotebookText, Send } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FrameTexture } from "@/components/frame";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const t = useTranslations("Home");

  return (
    <section className="relative z-0 flex flex-col font-mono">
      <FrameTexture />
      <div className="container flex w-full flex-col justify-center py-12 sm:py-24">
        <div className="grid grid-cols-1 gap-y-8 text-left sm:grid-cols-[1fr_auto] sm:gap-x-12 sm:gap-y-10">
          <div className="col-start-1 row-start-1 flex flex-col items-start gap-1.5 self-center sm:gap-3 sm:self-start">
            <h1 className="home-reveal font-semibold text-3xl text-foreground leading-tight tracking-tight sm:text-4xl md:text-5xl">
              {t("name")}
            </h1>
            <div className="home-reveal home-reveal--later flex max-w-md flex-col gap-0.5 text-base text-muted-foreground leading-relaxed md:text-lg">
              <p>{t("title")}</p>
              <p>{t("company")}</p>
            </div>
          </div>
          <Image
            className="col-start-2 row-start-1 hidden aspect-square size-24 self-center border-none object-cover shadow-sm invert [clip-path:inset(1px)] sm:row-span-2 sm:block sm:h-full sm:w-auto sm:self-stretch dark:invert-0"
            src="/avatar.jpg"
            alt={t("name")}
            width={176}
            height={176}
            sizes="(min-width: 640px) 176px, 96px"
            quality={60}
            priority
          />
          <div className="col-start-1 row-start-2 flex gap-3 sm:gap-4">
            <Link
              href="/notes"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 flex-1 rounded-none font-mono text-base sm:min-w-44 sm:flex-none",
              )}
            >
              <NotebookText />
              {t("notes")}
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 flex-1 rounded-none font-mono text-base sm:min-w-44 sm:flex-none",
              )}
            >
              <Send />
              {t("contact")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
