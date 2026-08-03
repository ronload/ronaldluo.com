import type * as React from "react";
import { createMap } from "svg-dotted-map";

import { cn } from "@/lib/utils";

interface SquareDottedMapProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  mapSamples?: number;
  dotColor?: string;
  dotSize?: number;
  stagger?: boolean;
}

interface DotPathOptions {
  width: number;
  height: number;
  mapSamples: number;
  dotSize: number;
  stagger: boolean;
}

const pathCache = new Map<string, string>();

// createMap emits 16 significant decimals; 2 is well below one device pixel here.
const coord = (value: number) =>
  value
    .toFixed(2)
    .replace(/(\.\d*?)0+$/, "$1")
    .replace(/\.$/, "")
    .replace(/^(-?)0\./, "$1.");

function dotPath({ width, height, mapSamples, dotSize, stagger }: DotPathOptions) {
  const key = `${width}x${height}@${mapSamples}/${dotSize}${stagger ? "/stagger" : ""}`;
  const cached = pathCache.get(key);
  if (cached !== undefined) return cached;

  const { points } = createMap({ width, height, mapSamples });
  const sorted = [...points].sort((a, b) => a.y - b.y || a.x - b.x);

  const rows = sorted.reduce(
    (acc, { y }) => (acc.has(y) ? acc : acc.set(y, acc.size)),
    new Map<number, number>(),
  );

  const xStep = sorted.reduce((step, point, index) => {
    const previous = sorted[index - 1];
    if (index === 0 || previous.y !== point.y) return step;
    const distance = point.x - previous.x;
    return distance > 0 && (step === 0 || distance < step) ? distance : step;
  }, 0);

  const half = dotSize / 2;
  const side = coord(dotSize);
  const d = sorted
    .map((point) => {
      const offset = stagger && (rows.get(point.y) ?? 0) % 2 === 1 ? xStep / 2 : 0;
      const x = coord(point.x + offset - half);
      const y = coord(point.y - half);
      return `M${x},${y}h${side}v${side}h-${side}z`;
    })
    .join("");

  pathCache.set(key, d);
  return d;
}

export function SquareDottedMap({
  width = 150,
  height = 75,
  mapSamples = 5000,
  dotColor = "currentColor",
  dotSize = 0.4,
  stagger = true,
  className,
  style,
  ...svgProps
}: SquareDottedMapProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${width} ${height}`}
      className={cn("text-gray-500 dark:text-gray-500", className)}
      style={{ width: "100%", height: "100%", ...style }}
      {...svgProps}
    >
      <path d={dotPath({ width, height, mapSamples, dotSize, stagger })} fill={dotColor} />
    </svg>
  );
}
