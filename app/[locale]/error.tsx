"use client";

import { ArrowLeft, RotateCw, TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { Divider, FrameTexture } from "@/components/frame";
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
    <>
      <section className="relative z-0 flex flex-col">
        <FrameTexture />
        <div className="container flex w-full flex-col items-center justify-center py-12 sm:py-24">
          <TriangleAlert
            aria-hidden="true"
            className="size-28 text-foreground/80 sm:size-36 md:size-44"
            strokeWidth={1.25}
          />
        </div>
      </section>
      <section className="relative z-0 flex flex-1 flex-col bg-background">
        <Divider />
        <div className="container flex w-full flex-1 items-center justify-center pt-12 pb-20 sm:pt-16 sm:pb-24">
          <div className="flex w-4/5 max-w-md flex-col items-center text-center">
            <h1 className="font-semibold text-3xl text-foreground leading-tight tracking-tight sm:text-4xl">
              Something went wrong
            </h1>
            <p className="wrap-break-word mt-3 break-keep text-lg text-muted-foreground leading-8">
              An unexpected error occurred while loading this page. You can try again, or head back
              home.
            </p>
            <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                onClick={() => unstable_retry()}
                size="lg"
                className="h-12 w-full px-4 text-base"
              >
                <RotateCw />
                Try again
              </Button>
              <Link
                href="/"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 w-full px-4 text-base",
                )}
              >
                <ArrowLeft />
                Go back home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
