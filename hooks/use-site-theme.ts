"use client";

import { useTheme } from "next-themes";
import { isThemeId, resolveTheme, type ThemePreference } from "@/lib/theme-registry";

export function useSiteTheme() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const activeTheme = resolveTheme(theme, resolvedTheme);
  const preference: ThemePreference = isThemeId(theme) ? theme : activeTheme.id;

  return {
    activeTheme,
    preference,
    setPreference: (nextTheme: ThemePreference) => setTheme(nextTheme),
  };
}
