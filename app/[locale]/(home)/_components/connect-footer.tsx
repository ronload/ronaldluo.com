import { useTranslations } from "next-intl";
import { ConnectMap } from "@/components/connect-map";
import { Divider, FrameTexture } from "@/components/frame";
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
        <h2 className="home-reveal home-reveal--after-title font-semibold text-2xl text-foreground tracking-tight sm:text-3xl">
          {t("connect")}
        </h2>
        <div className="home-reveal-group home-reveal-group--later mt-6 flex items-center justify-center gap-1 sm:mt-8 sm:gap-2">
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
        className="pointer-events-none relative mt-4 h-[clamp(12rem,38vw,21rem)] overflow-hidden sm:mt-6"
      >
        <ConnectMap className="absolute top-0 left-1/2 w-[clamp(24rem,76vw,42rem)] -translate-x-1/2" />
      </div>
      <div className="container mt-4 pb-6 text-center sm:mt-6">
        <p className="text-muted-foreground text-xs">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
