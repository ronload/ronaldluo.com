import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { StatusHero, StatusPage } from "@/components/status-page";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  alternates: { canonical: null },
};

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <StatusPage
      hero={<StatusHero>404</StatusHero>}
      titleAs="h2"
      title={t("title")}
      description={t("description")}
      actions={
        <>
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
        </>
      }
    />
  );
}
