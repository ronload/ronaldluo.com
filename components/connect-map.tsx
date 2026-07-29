import { SquareDottedMap } from "@/components/square-dotted-map";
import { cn } from "@/lib/utils";

export function ConnectMap({ className }: { className?: string }) {
  return (
    <div className={cn("aspect-[2/1]", className)}>
      <SquareDottedMap dotColor="color-mix(in srgb, var(--primary) 42%, transparent)" />
    </div>
  );
}
