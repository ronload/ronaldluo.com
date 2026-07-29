"use client";

import createGlobe, { type COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

import { useSiteTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const MOVEMENT_DAMPING = 1400;

const GLOBE_CONFIG: Omit<COBEOptions, "dark" | "baseColor" | "markerColor" | "glowColor"> = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
};

type GlobeThemeConfig = Pick<COBEOptions, "dark" | "baseColor" | "markerColor" | "glowColor">;

const defaultGlobeThemeConfig: GlobeThemeConfig = {
  baseColor: [154 / 255, 165 / 255, 206 / 255],
  dark: 0,
  glowColor: [225 / 255, 226 / 255, 231 / 255],
  markerColor: [177 / 255, 92 / 255, 0],
};

function themeGlobeConfig(dark: boolean): GlobeThemeConfig {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const fallback = dark
    ? {
        base: [122 / 255, 162 / 255, 247 / 255] as [number, number, number],
        glow: [26 / 255, 27 / 255, 38 / 255] as [number, number, number],
        marker: [224 / 255, 175 / 255, 104 / 255] as [number, number, number],
      }
    : {
        base: defaultGlobeThemeConfig.baseColor,
        glow: defaultGlobeThemeConfig.glowColor,
        marker: defaultGlobeThemeConfig.markerColor,
      };

  const read = (token: string, fallbackColor: [number, number, number]) => {
    if (!ctx) return fallbackColor;
    ctx.fillStyle = `rgb(${fallbackColor.map((channel) => channel * 255).join(" ")})`;
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

    return [r / 255, g / 255, b / 255] as [number, number, number];
  };

  return {
    dark: dark ? 1 : 0,
    baseColor: read("--theme-globe-base", fallback.base),
    markerColor: read("--theme-globe-marker", fallback.marker),
    glowColor: read("--theme-globe-glow", fallback.glow),
  };
}

export function Globe({
  className,
  config,
}: {
  className?: string;
  config?: COBEOptions;
}) {
  const { activeTheme } = useSiteTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const themeConfigRef = useRef<GlobeThemeConfig>(defaultGlobeThemeConfig);
  const widthRef = useRef(0);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });
  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  useEffect(() => {
    if (!config) themeConfigRef.current = themeGlobeConfig(activeTheme.dark);
  }, [activeTheme.dark, activeTheme.id, config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const globeConfig: COBEOptions = config ?? {
      ...GLOBE_CONFIG,
      ...themeConfigRef.current,
    };

    const onResize = () => {
      widthRef.current = canvas.offsetWidth;
    };

    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvas, {
      ...globeConfig,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      onRender: (state) => {
        if (!config) Object.assign(state, themeConfigRef.current);
        if (!pointerInteracting.current) phiRef.current += 0.005;
        state.phi = phiRef.current + rs.get();
        state.width = widthRef.current * 2;
        state.height = widthRef.current * 2;
      },
    });

    const reveal = window.setTimeout(() => (canvas.style.opacity = "1"), 0);
    return () => {
      window.clearTimeout(reveal);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [config, rs]);

  return (
    <div className={cn("absolute inset-0 mx-auto aspect-square w-full max-w-150", className)}>
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 contain-[layout_paint_size]",
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)}
      />
    </div>
  );
}
