import type * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type GradientButtonProps = React.ComponentProps<typeof Button> & {
  glowClassName?: string;
};

function GradientGlow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "gradient-glow pointer-events-none absolute inset-0 -z-10 rounded-[inherit]",
        className,
      )}
    />
  );
}

function GradientButton({ className, glowClassName, children, ...props }: GradientButtonProps) {
  return (
    <Button className={cn("relative isolate", className)} {...props}>
      <GradientGlow className={glowClassName} />
      {children}
    </Button>
  );
}

export type { GradientButtonProps };
export { GradientButton, GradientGlow };
