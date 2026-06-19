import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/ronload",
        permanent: true,
      },
      {
        source: "/linkedin",
        destination: "https://www.linkedin.com/in/luo-yong-neng",
        permanent: true,
      },
      {
        source: "/x",
        destination: "https://x.com/ron1oad",
        permanent: true,
      },
      {
        source: "/twitter",
        destination: "https://x.com/ron1oad",
        permanent: true,
      },
      {
        source: "/facebook",
        destination: "https://www.facebook.com/RonTwps",
        permanent: true,
      },
      {
        source: "/fb",
        destination: "https://www.facebook.com/RonTwps",
        permanent: true,
      },
      {
        source: "/instagram",
        destination: "https://www.instagram.com/ynent",
        permanent: true,
      },
      {
        source: "/ig",
        destination: "https://www.instagram.com/ynent",
        permanent: true,
      },
      {
        source: "/ins",
        destination: "https://www.instagram.com/ynent",
        permanent: true,
      },
      {
        source: "/threads",
        destination: "https://www.threads.com/@ynent",
        permanent: true,
      },
      {
        source: "/shopee",
        destination: "https://shopee.tw/ronlo",
        permanent: true,
      },
      {
        source: "/dotfiles",
        destination: "https://github.com/ronload/dotfiles",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
