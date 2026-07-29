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
  const { points } = createMap({ width, height, mapSamples });
  const sortedPoints = [...points].sort((a, b) => a.y - b.y || a.x - b.x);
  const rows = new Map<number, number>();
  let xStep = 0;
  let previousY = Number.NaN;
  let previousX = Number.NaN;

  for (const point of sortedPoints) {
    if (point.y !== previousY) {
      previousY = point.y;
      previousX = Number.NaN;
      if (!rows.has(point.y)) rows.set(point.y, rows.size);
    }

    if (!Number.isNaN(previousX)) {
      const distance = point.x - previousX;
      if (distance > 0) xStep = xStep === 0 ? distance : Math.min(xStep, distance);
    }

    previousX = point.x;
  }

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${width} ${height}`}
      className={cn("text-gray-500 dark:text-gray-500", className)}
      style={{ width: "100%", height: "100%", ...style }}
      {...svgProps}
    >
      {points.map((point) => {
        const rowIndex = rows.get(point.y) ?? 0;
        const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0;

        return (
          <rect
            fill={dotColor}
            height={dotSize}
            key={`${point.x}-${point.y}`}
            width={dotSize}
            x={point.x + offsetX - dotSize / 2}
            y={point.y - dotSize / 2}
          />
        );
      })}
    </svg>
  );
}
