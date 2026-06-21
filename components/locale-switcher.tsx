"use client";

import { Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher({ label }: { label: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const nextLocale = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={label}
      disabled={isPending}
      onClick={() => startTransition(() => router.replace(pathname, { locale: nextLocale }))}
    >
      <Languages />
    </Button>
  );
}
