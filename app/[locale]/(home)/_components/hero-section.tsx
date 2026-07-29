import { NotebookText, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { FrameTexture } from "@/components/frame";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function HomeShine() {
  return <span aria-hidden className="home-shine z-10" />;
}

export function HeroSection() {
  const t = useTranslations("Home");

  return (
    <section className="relative z-0 flex flex-col font-mono">
      <FrameTexture />
      <div className="container flex w-full flex-col justify-center py-12 sm:py-24 md:py-19">
        <div className="grid grid-cols-1 gap-y-8 text-left sm:grid-cols-[1fr_auto] sm:gap-x-12">
          <div className="col-start-1 row-start-1 flex flex-col items-start gap-1.5 self-center sm:gap-3 sm:self-stretch">
            <h1 className="home-reveal font-semibold text-3xl text-foreground leading-tight tracking-tight sm:text-4xl md:text-5xl">
              {t("name")}
            </h1>
            <div className="home-reveal home-reveal--later flex max-w-md flex-col gap-0.5 text-base text-muted-foreground leading-relaxed md:text-lg">
              <p>{t("title")}</p>
              <p>{t("company")}</p>
            </div>
          </div>
          <div className="col-start-1 row-start-2 flex gap-3 sm:col-start-2 sm:row-start-1 sm:flex-col sm:justify-center sm:gap-4 sm:self-stretch">
            <div className="home-shine-frame flex-1 sm:min-w-44 sm:flex-none">
              <HomeShine />
              <Link
                href="/notes"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "home-surface-enter flex h-12 w-full rounded-none font-mono text-base",
                )}
              >
                <NotebookText />
                {t("notes")}
              </Link>
            </div>
            <div className="home-shine-frame flex-1 sm:min-w-44 sm:flex-none">
              <HomeShine />
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "home-surface-enter flex h-12 w-full rounded-none font-mono text-base",
                )}
              >
                <Send />
                {t("contact")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
