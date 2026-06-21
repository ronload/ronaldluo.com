import { ArrowLeft, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <section className="container flex flex-1 flex-col items-center justify-center gap-6 py-24 text-center">
      <div className="relative">
        <h1 className="bg-gradient-to-b from-foreground via-foreground to-muted-foreground bg-clip-text font-bold text-[120px] text-transparent leading-none tracking-tighter sm:text-[180px] md:text-[220px]">
          404
        </h1>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-foreground/20 to-transparent blur-3xl" />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-medium text-foreground text-xl sm:text-2xl">Page not found</h2>
        <p className="max-w-md text-muted-foreground text-sm sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you
          back on track.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Link href="/" className={cn(buttonVariants({ size: "lg" }), "group h-12 px-6 text-base")}>
          <ArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
          Go back home
        </Link>
        <Link
          href="/contact"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "group h-12 px-6 text-base",
          )}
        >
          Contact me
          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
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
