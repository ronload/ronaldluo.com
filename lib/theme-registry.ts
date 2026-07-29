export type ThemeId =
  | "tokyonight-day"
  | "tokyonight-night"
  | "tokyonight-storm"
  | "tokyonight-moon"
  | "catppuccin-latte"
  | "catppuccin-frappe"
  | "catppuccin-macchiato"
  | "catppuccin-mocha"
  | "rose-pine-dawn"
  | "rose-pine-moon"
  | "rose-pine"
  | "one-light"
  | "one-dark-pro"
  | "one-dark-pro-darker"
  | "one-dark-pro-flat"
  | "one-dark-pro-mix"
  | "one-dark-pro-night-flat";

export type ThemePreference = ThemeId;

export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  dark: boolean;
}

export interface ThemeGroup {
  label: string;
  themes: readonly ThemeDefinition[];
}

const tokyonight: readonly ThemeDefinition[] = [
  {
    id: "tokyonight-day",
    label: "Tokyo Night Day",
    dark: false,
  },
  {
    id: "tokyonight-night",
    label: "Tokyo Night Night",
    dark: true,
  },
  {
    id: "tokyonight-storm",
    label: "Tokyo Night Storm",
    dark: true,
  },
  {
    id: "tokyonight-moon",
    label: "Tokyo Night Moon",
    dark: true,
  },
];

const catppuccin: readonly ThemeDefinition[] = [
  {
    id: "catppuccin-latte",
    label: "Catppuccin Latte",
    dark: false,
  },
  {
    id: "catppuccin-frappe",
    label: "Catppuccin Frappe",
    dark: true,
  },
  {
    id: "catppuccin-macchiato",
    label: "Catppuccin Macchiato",
    dark: true,
  },
  {
    id: "catppuccin-mocha",
    label: "Catppuccin Mocha",
    dark: true,
  },
];

const rosePine: readonly ThemeDefinition[] = [
  {
    id: "rose-pine-dawn",
    label: "Rose Pine Dawn",
    dark: false,
  },
  {
    id: "rose-pine-moon",
    label: "Rose Pine Moon",
    dark: true,
  },
  {
    id: "rose-pine",
    label: "Rose Pine",
    dark: true,
  },
];

const one: readonly ThemeDefinition[] = [
  {
    id: "one-light",
    label: "One Light",
    dark: false,
  },
  {
    id: "one-dark-pro",
    label: "One Dark Pro",
    dark: true,
  },
  {
    id: "one-dark-pro-darker",
    label: "One Dark Pro Darker",
    dark: true,
  },
  {
    id: "one-dark-pro-flat",
    label: "One Dark Pro Flat",
    dark: true,
  },
  {
    id: "one-dark-pro-mix",
    label: "One Dark Pro Mix",
    dark: true,
  },
  {
    id: "one-dark-pro-night-flat",
    label: "One Dark Pro Night Flat",
    dark: true,
  },
];

export const themeGroups: readonly ThemeGroup[] = [
  { label: "Tokyo Night", themes: tokyonight },
  { label: "Catppuccin", themes: catppuccin },
  { label: "Rose Pine", themes: rosePine },
  { label: "One", themes: one },
];

export const themeDefinitions = themeGroups.flatMap((group) => group.themes);
export const themeIds = themeDefinitions.map((theme) => theme.id);
export const providerThemes = ["light", "dark", ...themeIds];

export function isThemeId(value: string | undefined): value is ThemeId {
  return themeDefinitions.some((theme) => theme.id === value);
}

export function getTheme(id: ThemeId): ThemeDefinition {
  const theme = themeDefinitions.find((candidate) => candidate.id === id);
  if (!theme) throw new Error(`Unknown theme: ${id}`);

  return theme;
}

export function resolveTheme(
  preference: string | undefined,
  resolvedTheme: string | undefined,
): ThemeDefinition {
  if (isThemeId(preference)) return getTheme(preference);

  return getTheme(resolvedTheme === "dark" ? "tokyonight-night" : "one-light");
}
