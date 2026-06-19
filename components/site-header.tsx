import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Divider } from "@/components/frame";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const t = useTranslations("Header");

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 w-full items-center justify-between gap-2">
          <Link href="/contact" className={cn(buttonVariants({ variant: "outline" }))}>
            <Send />
            {t("contact")}
          </Link>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <LocaleSwitcher />
          </div>
        </div>
      </header>
      {/*
        The header's bottom divider lives OUTSIDE <header> on purpose. A sticky
        element always creates its own stacking context, so a divider nested in
        the header would be trapped at the header's z-40 and render beneath the
        FrameGuides (z-45). Its corner dots could then no longer cap the
        guide/divider intersection the way the in-page section dividers (z-50)
        do, leaving a see-through point at the junction. As a page-level sticky
        sibling it shares the frame's stacking layer (z-50, above the guides) and
        pins to the header's bottom edge (top-16 matches the header's h-16).
      */}
      <div className="pointer-events-none sticky top-16 z-50 h-0">
        <Divider />
      </div>
    </>
  );
}
