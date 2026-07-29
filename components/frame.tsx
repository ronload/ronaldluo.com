import { FrameAnimation } from "@/components/frame-animation";
import { cn } from "@/lib/utils";

interface FrameProps {
  className?: string;
  children?: React.ReactNode;
}

export function PageFrame({ className, children }: FrameProps) {
  return (
    <div className={cn("relative isolate flex min-h-svh flex-1 flex-col overflow-clip", className)}>
      {children}
    </div>
  );
}

export function FrameTexture({ className }: FrameProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("container pointer-events-none absolute inset-0 -z-10", className)}
    >
      <div
        className="absolute inset-y-0 -right-3 -left-3 bg-background"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 2px, color-mix(in srgb, var(--secondary) 36%, var(--background)) 2px, color-mix(in srgb, var(--secondary) 36%, var(--background)) 4px)",
        }}
      />
    </div>
  );
}

export function FrameGuides({ className }: FrameProps) {
  return (
    <FrameAnimation
      className={cn(
        "frame-guides container pointer-events-none absolute inset-0 z-45",
        "before:absolute before:top-0 before:-left-3 before:h-full before:w-px before:bg-border",
        "after:absolute after:top-0 after:-right-3 after:h-full after:w-px after:bg-border",
        className,
      )}
    />
  );
}

interface FrameAsideProps extends FrameProps {
  side?: "start" | "end";
}

export function FrameAside({ className, children, side = "end" }: FrameAsideProps) {
  return (
    <div
      className={cn(
        "absolute inset-y-0 hidden 3xl:w-[calc((100%_-_72rem)/2)] w-[calc((100%_-_56rem)/2)] xl:block",
        side === "start"
          ? "start-0 ps-4 pe-[calc(0.75rem_+_1px_+_1rem)]"
          : "end-0 ps-[calc(0.75rem_+_1px_+_1rem)] pe-4",
        className,
      )}
    >
      <div className="sticky top-16 pt-6">{children}</div>
    </div>
  );
}

export function Divider({ className }: FrameProps) {
  return (
    <FrameAnimation
      className={cn(
        "frame-divider pointer-events-none absolute inset-x-0 top-0 z-50 h-px",
        "before:absolute before:inset-y-0 before:left-0 before:w-full before:bg-border",
        className,
      )}
    >
      <div
        className={cn(
          "container absolute inset-x-0 top-0",
          "before:absolute before:top-[-3.5px] before:-left-[11.5px] before:-ml-1 before:size-2 before:border before:border-border/40 before:bg-background before:bg-clip-border before:shadow-xs",
          "after:absolute after:top-[-3.5px] after:-right-[11.5px] after:-mr-1 after:size-2 after:border after:border-border/40 after:bg-background after:bg-clip-border after:shadow-xs",
        )}
      />
    </FrameAnimation>
  );
}
