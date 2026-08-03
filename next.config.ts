import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { SOCIAL_LINKS } from "./lib/socials";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx"],
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
