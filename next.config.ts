import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { SITE_URL } from "./lib/site-url";
import { SOCIAL_LINKS } from "./lib/socials";

// Anchored as `^...$` by Next, so this cannot be spoofed by a longer hostname.
const VANITY_HOST = "(www\\.)?ronald\\.love";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx"],
  experimental: {
    globalNotFound: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
  },
  async redirects() {
    const socialRedirects = SOCIAL_LINKS.flatMap((social) => [
      { source: `/${social.id}`, destination: social.url, permanent: true },
      ...(social.aliases ?? []).map((alias) => ({
        source: `/${alias}`,
        destination: social.url,
        permanent: true,
      })),
    ]);

    return [
      // Must stay first: otherwise ronald.love/github matches a social redirect
      // and leaves for GitHub instead of landing on the one page it exists for.
      {
        source: "/:path*",
        has: [{ type: "host", value: VANITY_HOST }],
        destination: `${SITE_URL}/love`,
        permanent: false,
      },
      ...socialRedirects,
      {
        source: "/dotfiles",
        destination: "https://github.com/ronload/dotfiles",
        permanent: true,
      },
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

const withNextIntl = createNextIntlPlugin({
  experimental: {
    messages: {
      format: "json",
      path: "./messages",
      locales: "infer",
      precompile: true,
    },
  },
});
const withMDX = createMDX();

export default withNextIntl(withMDX(nextConfig));
