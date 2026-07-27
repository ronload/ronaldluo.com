import { remarkMdxMermaid } from "fumadocs-core/mdx-plugins";
import { defineCollections, defineConfig } from "fumadocs-mdx/config";
import remarkCjkFriendly from "remark-cjk-friendly/parseOnly";
import remarkJoinCjkLines from "remark-join-cjk-lines";
import { z } from "zod";

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
      themes: { light: "github-light", dark: "github-dark" },
      icon: false,
      tab: false,
    },
  },
});
