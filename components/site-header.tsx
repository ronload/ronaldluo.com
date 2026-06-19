import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Divider } from "@/components/frame";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const t = useTranslations("Header");

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 w-full items-center justify-between gap-2">
        <a
          href="mailto:ronald@ronaldluo.com"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <Mail />
          {t("contact")}
        </a>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <LocaleSwitcher />
        </div>
      </div>
      <Divider className="top-auto bottom-0" />
    </header>
  );
}
