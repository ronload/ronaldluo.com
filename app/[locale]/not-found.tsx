import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Divider, FrameTexture } from "@/components/frame";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <>
      <section className="relative z-0 flex flex-col">
        <FrameTexture />
        <div className="container flex w-full flex-col items-center justify-center py-12 sm:py-24">
          <h1 className="bg-gradient-to-b from-foreground via-foreground to-muted-foreground bg-clip-text font-bold font-mono text-[120px] text-transparent leading-none tracking-tighter sm:text-[180px] md:text-[220px]">
            404
          </h1>
        </div>
      </section>
      <section className="relative z-0 flex flex-1 flex-col bg-background">
        <Divider />
        <div className="container flex w-full flex-1 items-center justify-center pt-12 pb-20 sm:pt-16 sm:pb-24">
          <div className="flex w-4/5 max-w-md flex-col items-center text-center">
            <h2 className="font-semibold text-3xl text-foreground leading-tight tracking-tight sm:text-4xl">
              {t("title")}
            </h2>
            <p className="wrap-break-word mt-3 break-keep text-lg text-muted-foreground leading-8">
              {t("description")}
            </p>
            <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href="/"
                className={cn(buttonVariants({ size: "lg" }), "h-12 w-full px-4 text-base")}
              >
                <ArrowLeft />
                {t("backToHome")}
              </Link>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 w-full px-4 text-base",
                )}
              >
                {t("contact")}
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
