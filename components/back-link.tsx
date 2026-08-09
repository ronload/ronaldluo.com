import { ArrowLeft } from "lucide-react";
import type { ComponentProps } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface BackLinkProps {
  href: ComponentProps<typeof Link>["href"];
  label: string;
}

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <div className="container pt-6">
      <Link
        className={cn(
          buttonVariants({ variant: "link", size: "sm" }),
          "-ms-3 gap-2 text-muted-foreground transition-colors hover:text-foreground",
        )}
        href={href}
      >
        <ArrowLeft />
        {label}
      </Link>
    </div>
  );
}
