"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  copiedLabel: string;
  className?: string;
}

export function CopyButton({ label, copiedLabel, className }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <Button
      aria-label={copied ? copiedLabel : label}
      className={cn("text-muted-foreground", className)}
      onClick={(event) => {
        const code = event.currentTarget.closest("figure")?.querySelector("pre")?.textContent;
        if (!code) return;
        void navigator.clipboard.writeText(code).then(() => {
          setCopied(true);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setCopied(false), 2000);
        });
      }}
      size="icon-sm"
      variant="ghost"
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  );
}
