import { remarkMdxMermaid } from "fumadocs-core/mdx-plugins";
import { defineCollections, defineConfig } from "fumadocs-mdx/config";
import remarkCjkFriendly from "remark-cjk-friendly/parseOnly";
import remarkJoinCjkLines from "remark-join-cjk-lines";
import { z } from "zod";
import tokyoNightDark from "./themes/tokyo-night-dark.json";
import tokyoNightDay from "./themes/tokyo-night-day.json";

export const notes = defineCollections({
  type: "doc",
  dir: "content/notes",
  lastModified: true,
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.iso.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: (v) => [remarkCjkFriendly, remarkJoinCjkLines, remarkMdxMermaid, ...v],
    rehypeCodeOptions: {
      themes: {
        "tokyonight-day": { ...tokyoNightDay, type: "light" },
        "tokyonight-night": { ...tokyoNightDark, type: "dark" },
        "tokyonight-storm": { ...tokyoNightDark, type: "dark" },
        "tokyonight-moon": { ...tokyoNightDark, type: "dark" },
        "catppuccin-latte": "catppuccin-latte",
        "catppuccin-frappe": "catppuccin-frappe",
        "catppuccin-macchiato": "catppuccin-macchiato",
        "catppuccin-mocha": "catppuccin-mocha",
        "rose-pine-dawn": "rose-pine-dawn",
        "rose-pine-moon": "rose-pine-moon",
        "rose-pine": "rose-pine",
        "one-light": "one-light",
        "one-dark-pro": "one-dark-pro",
        "one-dark-pro-darker": "one-dark-pro",
        "one-dark-pro-flat": "one-dark-pro",
        "one-dark-pro-mix": "one-dark-pro",
        "one-dark-pro-night-flat": "one-dark-pro",
      },
      icon: false,
      tab: false,
    },
  },
});
