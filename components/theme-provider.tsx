"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ComponentProps, useEffect } from "react";
import { isThemeId, resolveTheme, type ThemePreference } from "@/lib/theme-registry";

function ThemeInitializer() {
  const { resolvedTheme, setTheme, theme } = useTheme();

  useEffect(() => {
    if (isThemeId(theme)) return;
    setTheme(resolveTheme(theme, resolvedTheme).id);
  }, [resolvedTheme, setTheme, theme]);

  return null;
}

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ThemeInitializer />
      {children}
    </NextThemesProvider>
  );
}

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
