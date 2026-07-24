import { useTranslations } from "next-intl";
import { Divider, FrameTexture } from "@/components/frame";
import { GlobeCanvas } from "@/components/globe-canvas";
import { buttonVariants } from "@/components/ui/button";
import { ACTIVE_CHANNELS } from "@/lib/contact-channels";
import { cn, externalLinkProps } from "@/lib/utils";

export function ConnectFooter() {
  const t = useTranslations("Home");

  return (
    <footer className="relative">
      <FrameTexture />
      <Divider />
      <div className="container flex flex-col items-center pt-16 text-center sm:pt-20">
        <h2 className="font-semibold text-2xl text-foreground tracking-tight sm:text-3xl">
          {t("connect")}
        </h2>
        <div className="mt-6 flex items-center justify-center gap-1 sm:mt-8 sm:gap-2">
          {ACTIVE_CHANNELS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              {...externalLinkProps(href)}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-lg" }),
                "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-5" />
            </a>
          ))}
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none relative mt-4 h-[clamp(11rem,38vw,18rem)] overflow-hidden sm:mt-6"
      >
        <div className="absolute top-0 left-1/2 aspect-square w-[clamp(24rem,95vw,42rem)] -translate-x-1/2">
          <GlobeCanvas className="max-w-none" />
        </div>
      </div>
    </footer>
  );
}
