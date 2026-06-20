import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { SOCIAL_LINKS } from "./lib/socials";

const nextConfig: NextConfig = {
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
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
