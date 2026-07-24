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

export function FrameGuides({ className }: FrameProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "container pointer-events-none absolute inset-0 z-45",
        "before:absolute before:inset-y-0 before:-left-3 before:w-px before:bg-border/64",
        "after:absolute after:inset-y-0 after:-right-3 after:w-px after:bg-border/64",
        className,
      )}
    />
  );
}

export function Divider({ className }: FrameProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-50 h-px bg-border/64",
        className,
      )}
    >
      <div
        className={cn(
          "container absolute inset-x-0 top-0",
          "before:absolute before:top-[-3.5px] before:-left-[11.5px] before:-ml-1 before:size-2 before:rounded-[2px] before:border before:border-border before:bg-popover before:bg-clip-padding before:shadow-xs dark:before:bg-clip-border",
          "after:absolute after:top-[-3.5px] after:-right-[11.5px] after:-mr-1 after:size-2 after:rounded-[2px] after:border after:border-border after:bg-background after:bg-clip-padding after:shadow-xs dark:after:bg-clip-border",
        )}
      />
    </div>
  );
}
