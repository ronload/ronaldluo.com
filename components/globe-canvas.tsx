"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const Globe = dynamic(() => import("@/components/ui/globe").then((m) => m.Globe), {
  ssr: false,
});

let cachedSupport: boolean | undefined;

function supportsWebGL() {
  if (cachedSupport !== undefined) return cachedSupport;
  try {
    const canvas = document.createElement("canvas");
    cachedSupport = Boolean(
      window.WebGLRenderingContext && (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    cachedSupport = false;
  }
  return cachedSupport;
}

const subscribe = () => () => {};

export function GlobeCanvas({ className }: { className?: string }) {
  const enabled = useSyncExternalStore(subscribe, supportsWebGL, () => false);

  if (!enabled) return null;
  return <Globe className={className} />;
}
