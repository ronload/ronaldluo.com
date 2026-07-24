import { Mail, Send } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FrameTexture } from "@/components/frame";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { PERSON } from "@/lib/identity";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const t = useTranslations("Home");

  return (
    <section className="relative z-0 flex flex-col">
      <FrameTexture />
      <div className="container flex w-full flex-col justify-center py-12 sm:py-24">
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
            className="col-start-2 row-start-1 aspect-square size-24 self-center rounded-full border-none object-cover shadow-sm invert sm:row-span-2 sm:h-full sm:w-auto sm:self-stretch dark:invert-0"
            src="/avatar.jpg"
            alt={t("name")}
            width={176}
            height={176}
            sizes="(min-width: 640px) 176px, 96px"
            quality={60}
            priority
          />
          <div className="col-span-2 row-start-2 flex gap-3 sm:col-span-1 sm:col-start-1 sm:gap-4">
            <a
              href={`mailto:${PERSON.email}`}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 flex-1 text-base sm:min-w-44 sm:flex-none",
              )}
            >
              <Mail />
              {t("email")}
            </a>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 flex-1 text-base sm:min-w-44 sm:flex-none",
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
