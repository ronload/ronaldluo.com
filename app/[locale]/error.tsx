"use client";

import { ArrowLeft, RotateCw, TriangleAlert } from "lucide-react";
import { useEffect } from "react";
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
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container flex flex-1 flex-col items-center justify-center gap-6 py-24 text-center">
      <div className="relative">
        <TriangleAlert
          className="size-28 text-foreground/80 sm:size-36 md:size-44"
          strokeWidth={1.25}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-foreground/20 to-transparent blur-3xl" />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-medium text-foreground text-xl sm:text-2xl">Something went wrong</h2>
        <p className="max-w-md text-muted-foreground text-sm sm:text-base">
          An unexpected error occurred while loading this page. You can try again, or head back
          home.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Button onClick={() => unstable_retry()} size="lg" className="group h-12 px-6 text-base">
          <RotateCw className="transition-transform duration-500 group-hover:rotate-180" />
          Try again
        </Button>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "group h-12 px-6 text-base",
          )}
        >
          <ArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
          Go back home
        </Link>
      </div>

      <div className="mt-12 flex items-center gap-3 text-muted-foreground">
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-border" />
        <span className="text-xs uppercase tracking-widest">Ronald Luo</span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-border" />
      </div>
    </section>
  );
}
