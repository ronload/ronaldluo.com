"use client";

import { ArrowLeft, RotateCw, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { StatusPage } from "@/components/status-page";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default function ErrorBoundary({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("Error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      hero={
        <TriangleAlert
          aria-hidden="true"
          className="size-28 text-foreground/80 sm:size-36 md:size-44"
          strokeWidth={1.25}
        />
      }
      title={t("title")}
      description={t("description")}
      actions={
        <>
          <Button onClick={() => unstable_retry()} size="lg" className="h-12 w-full px-4 text-base">
            <RotateCw />
            {t("retry")}
          </Button>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 w-full px-4 text-base",
            )}
          >
            <ArrowLeft />
            {t("backToHome")}
          </Link>
        </>
      }
    />
  );
}
