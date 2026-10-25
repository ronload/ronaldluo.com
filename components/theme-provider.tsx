"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ComponentProps, useEffect } from "react";
import { isThemeId, resolveTheme } from "@/lib/theme-registry";

function ThemeInitializer() {
  const { resolvedTheme, setTheme, theme } = useTheme();

  useEffect(() => {
    if (isThemeId(theme)) {
      return;
    }
    // biome-ignore lint/nursery/useReactCompiler: flagged by name only; next-themes' setTheme is not a useState setter
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
