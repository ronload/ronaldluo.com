import { House, NotebookText } from "lucide-react";
import { useTranslations } from "next-intl";
import { CommandMenu } from "@/components/command-menu";
import { Divider, FrameGuides } from "@/components/frame";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  commandMenu: React.ComponentProps<typeof CommandMenu>;
}

export function SiteHeader({ commandMenu }: SiteHeaderProps) {
  const t = useTranslations("Header");

  return (
    <header className="sticky top-0 z-40 w-full bg-background">
      <FrameGuides />
      <div className="container flex h-16 w-full items-center gap-2">
        <CommandMenu {...commandMenu} />
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/"
            aria-label={t("home")}
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "border-border/[0.32]",
            )}
          >
            <House />
          </Link>
          <Link
            href="/notes"
            aria-label={t("notes")}
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "border-border/[0.32]",
            )}
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
