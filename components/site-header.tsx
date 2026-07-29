import { House, NotebookText } from "lucide-react";
import { useTranslations } from "next-intl";
import { Divider, FrameGuides } from "@/components/frame";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const t = useTranslations("Header");

  return (
    <header className="sticky top-0 z-40 w-full bg-background">
      <FrameGuides />
      <div className="container flex h-16 w-full items-center justify-between gap-2">
        <ThemeSwitcher
          labels={{
            apply: t("theme.apply"),
            cancel: t("theme.cancel"),
            close: t("theme.close"),
            title: t("theme.title"),
            trigger: t("theme.trigger"),
          }}
        />
        <div className="flex items-center gap-2">
          <Link
            href="/"
            aria-label={t("home")}
            className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
          >
            <House />
          </Link>
          <Link
            href="/notes"
            aria-label={t("notes")}
            className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
          >
            <NotebookText />
          </Link>
          <LocaleSwitcher label={t("switchLanguage")} />
        </div>
      </div>
      <Divider className="top-full" />
    </header>
  );
}
