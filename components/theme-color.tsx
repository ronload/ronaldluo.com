"use client";

import { useEffect } from "react";
import { useSiteTheme } from "@/components/theme-provider";

export function ThemeColor() {
  const { activeTheme } = useSiteTheme();

  useEffect(() => {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue("--background")
      .trim();
    const tags = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');

    if (tags.length === 0) {
      const tag = document.createElement("meta");
      tag.name = "theme-color";
      tag.dataset.theme = activeTheme.id;
      document.head.append(tag);
      tag.content = color;
      return;
    }

    for (const tag of tags) {
      tag.content = color;
      tag.dataset.theme = activeTheme.id;
      tag.removeAttribute("media");
    }
  }, [activeTheme.id]);

  return null;
}
