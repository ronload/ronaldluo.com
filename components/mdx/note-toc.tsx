"use client";

import {
  AnchorProvider,
  ScrollProvider,
  TOCItem,
  type TOCItemInfo,
  type TOCItemType,
  useTOC,
  useTOCListener,
} from "fumadocs-core/toc";
import { Text } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const BASE = 8;
const SVG_NS = "http://www.w3.org/2000/svg";

function itemOffset(depth: number) {
  if (depth <= 2) return 12 + BASE;
  if (depth === 3) return 24 + BASE;
  return 36 + BASE;
}

function lineOffset(depth: number) {
  if (depth <= 2) return BASE;
  if (depth === 3) return 8 + BASE;
  return 16 + BASE;
}

interface Track {
  width: number;
  height: number;
  path: string;
  bounds: [top: number, bottom: number][];
  lengths: [top: number, bottom: number][];
}

function measure(container: HTMLElement, items: TOCItemType[]): Track | null {
  let width = 0;
  let height = 0;
  let path = "";
  let previous: [top: number, bottom: number, x: number] | undefined;
  const bounds: [number, number][] = [];

  for (const item of items) {
    const anchor = container.querySelector<HTMLElement>(`a[href="${item.url}"]`);
    if (!anchor) return null;

    const styles = getComputedStyle(anchor);
    const x = lineOffset(item.depth) + 0.5;
    const top = anchor.offsetTop + Number.parseFloat(styles.paddingTop);
    const bottom = anchor.offsetTop + anchor.clientHeight - Number.parseFloat(styles.paddingBottom);

    width = Math.max(width, x + 8);
    height = Math.max(height, bottom);
    path += previous
      ? ` C ${previous[2]} ${top - 4} ${x} ${previous[1] + 4} ${x} ${top} L${x} ${bottom}`
      : ` M${x} ${top} L${x} ${bottom}`;

    bounds.push([top, bottom]);
    previous = [top, bottom, x];
  }

  if (bounds.length === 0) return null;

  const probe = document.createElementNS(SVG_NS, "path");
  probe.setAttribute("d", path);
  const total = probe.getTotalLength();
  const lengths: [number, number][] = [];

  for (let index = 0; index < bounds.length; index++) {
    const [top, bottom] = bounds[index];
    let length = index === 0 ? top : lengths[index - 1][1] + (top - bounds[index - 1][1]);
    while (length < total && probe.getPointAtLength(length).y < top) length++;
    lengths.push([length, length + bottom - top]);
  }

  return { width, height, path, bounds, lengths };
}

interface Thumb {
  start: number;
  end: number;
  up: boolean;
}

function activeRange(infos: TOCItemInfo[]): [start: number, end: number] | null {
  let start = -1;
  let end = -1;

  for (let index = 0; index < infos.length; index++) {
    if (!infos[index].active) continue;
    if (start === -1) start = index;
    end = index;
  }

  return start === -1 ? null : [start, end];
}

function goesUp(previous: Thumb | null, start: number, end: number) {
  if (!previous) return false;

  return (
    previous.start > start ||
    previous.end > end ||
    (previous.start === start && previous.end === end && previous.up)
  );
}

function TrackHighlight({ track }: { track: Track }) {
  const ref = useRef<HTMLDivElement>(null);
  const thumb = useRef<Thumb | null>(null);
  const toc = useTOC();

  const apply = useCallback(
    (infos: TOCItemInfo[]) => {
      const element = ref.current;
      const range = activeRange(infos);
      if (!element || !range) return;

      const [start, end] = range;
      if (!track.bounds[start] || !track.bounds[end]) return;

      const up = goesUp(thumb.current, start, end);
      thumb.current = { start, end, up };

      element.style.setProperty("--track-top", `${track.bounds[start][0]}px`);
      element.style.setProperty("--track-bottom", `${track.bounds[end][1]}px`);
      element.style.setProperty(
        "--offset-distance",
        `${up ? track.lengths[start][0] : track.lengths[end][1]}px`,
      );
      element.style.setProperty("--opacity", "1");
    },
    [track],
  );

  useTOCListener(apply);

  useEffect(() => {
    apply(toc.get());
  }, [apply, toc]);

  return (
    <div
      className="pointer-events-none absolute start-0 top-0"
      ref={ref}
      style={{ width: track.width, height: track.height }}
    >
      <svg
        aria-hidden="true"
        className="absolute transition-[clip-path] duration-200"
        style={{
          width: track.width,
          height: track.height,
          clipPath:
            "polygon(0 var(--track-top,0), 100% var(--track-top,0), 100% var(--track-bottom,0), 0 var(--track-bottom,0))",
        }}
        viewBox={`0 0 ${track.width} ${track.height}`}
        xmlns={SVG_NS}
      >
        <path className="stroke-primary" d={track.path} fill="none" strokeWidth="1" />
      </svg>
      <div
        className="absolute left-0 size-1 bg-primary opacity-[var(--opacity,0)] transition-[opacity,offset-distance] [offset-distance:var(--offset-distance,0)]"
        style={{ offsetPath: `path("${track.path}")` }}
      />
    </div>
  );
}

interface LinkProps {
  item: TOCItemType;
  previousDepth?: number;
  nextDepth?: number;
  first: boolean;
  last: boolean;
}

function TocLink({ item, previousDepth, nextDepth, first, last }: LinkProps) {
  const guide = useMemo(() => {
    const l1 = lineOffset(item.depth);
    const l0 = previousDepth === undefined ? l1 : lineOffset(previousDepth);
    const l2 = nextDepth === undefined ? l1 : lineOffset(nextDepth);

    return (
      <svg
        aria-hidden="true"
        className={cn(
          "absolute start-0 -top-1.5 bottom-0 -z-1 h-[calc(100%_+_0.375rem)]",
          l1 !== l2 && "bottom-1.5 h-full",
        )}
        style={{ width: Math.max(l0, l1) + 9 }}
      >
        {l0 === l1 ? null : (
          <path
            className="stroke-foreground/10"
            d={`M ${l0 + 0.5} 0 C ${l0 + 0.5} 8 ${l1 + 0.5} 4 ${l1 + 0.5} 12`}
            fill="none"
            strokeWidth="1"
          />
        )}
        <line
          className="stroke-foreground/10"
          strokeWidth="1"
          x1={l1 + 0.5}
          x2={l1 + 0.5}
          y1={l0 === l1 ? 6 : 12}
          y2="100%"
        />
      </svg>
    );
  }, [item.depth, previousDepth, nextDepth]);

  return (
    <TOCItem
      className={cn(
        "wrap-anywhere relative py-1.5 text-muted-foreground text-sm leading-relaxed transition-colors hover:text-accent-foreground data-[active=true]:text-primary",
        first && "pt-0",
        last && "pb-0",
      )}
      href={item.url}
      style={{ paddingInlineStart: itemOffset(item.depth) }}
    >
      {guide}
      {item.title}
    </TOCItem>
  );
}

interface Props {
  items: TOCItemType[];
  label: string;
}

export function NoteToc({ items, label }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [track, setTrack] = useState<Track | null>(null);

  const remeasure = useCallback(() => {
    const container = listRef.current;
    if (!container || container.clientHeight === 0) return;
    setTrack(measure(container, items));
  }, [items]);

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    const observer = new ResizeObserver(remeasure);
    observer.observe(container);
    remeasure();

    return () => observer.disconnect();
  }, [remeasure]);

  return (
    <AnchorProvider toc={items}>
      <nav aria-labelledby="note-toc-label" className="flex max-h-[calc(100svh_-_8rem)] flex-col">
        <p
          className="inline-flex items-center gap-1.5 text-muted-foreground text-sm"
          id="note-toc-label"
        >
          <Text className="size-4 shrink-0" />
          {label}
        </p>
        <div
          className="relative ms-px min-h-0 overflow-y-auto overflow-x-clip py-3 [mask-image:linear-gradient(to_bottom,transparent,white_16px,white_calc(100%_-_16px),transparent)] [scrollbar-width:none]"
          ref={scrollRef}
        >
          <ScrollProvider containerRef={scrollRef}>
            <div className="relative flex flex-col" ref={listRef}>
              {track ? <TrackHighlight track={track} /> : null}
              {items.map((item, index) => (
                <TocLink
                  first={index === 0}
                  item={item}
                  key={item.url}
                  last={index === items.length - 1}
                  nextDepth={items[index + 1]?.depth}
                  previousDepth={items[index - 1]?.depth}
                />
              ))}
            </div>
          </ScrollProvider>
        </div>
      </nav>
    </AnchorProvider>
  );
}
