import type { ReactNode } from "react";
import { Divider, FrameHero } from "@/components/frame";

export function StatusHero({ children }: { children: ReactNode }) {
  return (
    <h1 className="bg-gradient-to-b from-foreground via-foreground to-muted-foreground bg-clip-text font-mono text-[120px] leading-none font-bold tracking-tighter text-transparent sm:text-[180px] md:text-[220px]">
      {children}
    </h1>
  );
}

interface StatusPageProps {
  hero: ReactNode;
  title: ReactNode;
  description: ReactNode;
  actions: ReactNode;
  titleAs?: "h1" | "h2";
}

export function StatusPage({
  actions,
  description,
  hero,
  title,
  titleAs: Title = "h1",
}: StatusPageProps) {
  return (
    <>
      <FrameHero>{hero}</FrameHero>
      <section className="relative z-0 flex flex-1 flex-col bg-background">
        <Divider />
        <div className="container flex w-full flex-1 items-center justify-center pt-12 pb-20 sm:pt-16 sm:pb-24">
          <div className="flex w-4/5 max-w-md flex-col items-center text-center">
            <Title className="text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </Title>
            <p className="mt-3 text-lg leading-8 wrap-break-word break-keep text-muted-foreground">
              {description}
            </p>
            <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">{actions}</div>
          </div>
        </div>
      </section>
    </>
  );
}
