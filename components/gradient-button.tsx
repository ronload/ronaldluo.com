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
        "pointer-events-none absolute inset-0 -z-10 rounded-[inherit]",
        "[box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]",
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
