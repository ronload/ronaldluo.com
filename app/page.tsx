import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-muted font-sans">
      <main className="flex flex-1 w-full max-w-5xl flex-col items-center justify-between py-32 px-16 bg-card sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-foreground">
            Placeholder
          </h1>
          <p className="max-w-md text-lg leading-8 text-muted-foreground">
            This page has not launch yet.
          </p>
        </div>
        <a
          href="https://github.com/ronload/ronaldluo.com"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ size: "lg" }), "text-base h-12 w-full md:w-36")}
        >
          <Image src="/github-icon-dark.svg" alt="Github icon" width={24} height={24} priority />
          Github
        </a>
      </main>
    </div>
  );
}
