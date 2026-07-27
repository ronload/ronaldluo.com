import type { ComponentProps } from "react";
import { CopyButton } from "@/components/mdx/copy-button";
import { cn } from "@/lib/utils";

interface Props extends ComponentProps<"pre"> {
  allowCopy?: string;
  copyLabel: string;
  copiedLabel: string;
}

export function CodeBlock({
  allowCopy,
  className,
  copiedLabel,
  copyLabel,
  title,
  ...props
}: Props) {
  return (
    <figure className="relative my-6 overflow-hidden rounded-xl border bg-code">
      {title ? (
        <figcaption className="border-b px-4 py-2 pe-12 font-mono text-muted-foreground text-xs">
          {title}
        </figcaption>
      ) : null}
      <pre
        {...props}
        className={cn(
          "overflow-x-auto py-4 font-mono text-[0.8125rem] leading-6 [&>code]:grid",
          className,
        )}
      />
      {allowCopy === "false" ? null : (
        <CopyButton
          className={cn("absolute end-2", title ? "top-1.5" : "top-2")}
          copiedLabel={copiedLabel}
          label={copyLabel}
        />
      )}
    </figure>
  );
}
