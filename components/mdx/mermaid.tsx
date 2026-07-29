"use client";

import { useDeferredValue, useEffect, useId, useRef, useState } from "react";
import { useSiteTheme } from "@/components/theme-provider";

const TOKENS = ["code", "foreground", "muted", "muted-foreground", "border"] as const;

type Palette = Record<(typeof TOKENS)[number], string>;

let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>) {
  const next = queue.then(task, task);
  queue = next.catch(() => undefined);

  return next;
}

function flatten(ctx: CanvasRenderingContext2D, base: string, color: string) {
  ctx.fillStyle = "#000000";
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 1, 1);
  ctx.fillStyle = "#000000";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function readPalette(): Palette | null {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  const probe = document.createElement("span");
  probe.style.cssText = "position:fixed;visibility:hidden";
  document.body.append(probe);

  const read = (token: string) => {
    probe.style.color = `var(--${token})`;
    return getComputedStyle(probe).color;
  };

  const base = flatten(ctx, "#ffffff", read("code"));
  const palette = {} as Palette;
  for (const token of TOKENS) palette[token] = flatten(ctx, base, read(token));
  probe.remove();

  return palette.foreground === palette.code ? null : palette;
}

function themeOptions(dark: boolean) {
  const palette = readPalette();
  if (!palette) return { theme: dark ? ("dark" as const) : ("neutral" as const) };

  return {
    theme: "base" as const,
    themeVariables: {
      background: palette.code,
      mainBkg: palette.muted,
      primaryColor: palette.muted,
      primaryTextColor: palette.foreground,
      primaryBorderColor: palette["muted-foreground"],
      secondaryColor: palette.code,
      tertiaryColor: palette.code,
      nodeBorder: palette["muted-foreground"],
      lineColor: palette["muted-foreground"],
      textColor: palette.foreground,
      titleColor: palette.foreground,
      clusterBkg: palette.code,
      clusterBorder: palette.border,
      edgeLabelBackground: palette.code,
      fontFamily: getComputedStyle(document.body).fontFamily,
      fontSize: "14px",
    },
  };
}

interface Result {
  svg: string;
  bind?: (element: Element) => void;
}

interface Props {
  chart: string;
}

export function Mermaid({ chart }: Props) {
  const slot = useId().replace(/[^a-zA-Z0-9]/g, "");
  const { activeTheme } = useSiteTheme();
  const renderedTheme = useDeferredValue(activeTheme);
  const [result, setResult] = useState<Result | null>(null);
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    enqueue(async () => {
      try {
        const { default: mermaid } = await import("mermaid");
        if (cancelled) return;

        mermaid.initialize({
          startOnLoad: false,
          suppressErrorRendering: true,
          ...themeOptions(renderedTheme.dark),
        });

        const { svg, bindFunctions } = await mermaid.render(
          `mermaid-${slot}-${renderedTheme.id}`,
          chart,
        );
        if (cancelled) return;

        setFailed(false);
        setResult({ svg, bind: bindFunctions });
      } catch {
        if (!cancelled) setFailed(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [chart, renderedTheme.dark, renderedTheme.id, slot]);

  useEffect(() => {
    const element = ref.current;
    if (!element || !result) return;

    element.innerHTML = result.svg;
    result.bind?.(element);
  }, [result]);

  if (failed) {
    return (
      <figure className="my-6 overflow-hidden border border-destructive/40 bg-code">
        <pre className="overflow-x-auto p-4 font-mono text-[0.8125rem] text-muted-foreground leading-6">
          {chart}
        </pre>
      </figure>
    );
  }

  return (
    <figure className="my-6 overflow-hidden border bg-code">
      <div
        className="flex min-h-32 items-center justify-center overflow-x-auto p-4 [&_svg]:h-auto [&_svg]:max-w-full"
        ref={ref}
      />
    </figure>
  );
}
