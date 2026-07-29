export interface SocialLink {
  id: string;
  label: string;
  url: string;
  archived?: boolean;
  aliases?: readonly string[];
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    url: "https://github.com/ronload",
    aliases: ["gh", "git", "code"],
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/luo-yong-neng",
    aliases: ["li", "in"],
  },
  { id: "x", label: "X", url: "https://x.com/ron1oad", aliases: ["twitter", "tweet", "tweets"] },
  {
    id: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/ynent",
    aliases: ["ig", "ins"],
  },
  { id: "threads", label: "Threads", url: "https://www.threads.com/@ynent" },
  {
    id: "facebook",
    label: "Facebook",
    url: "https://www.facebook.com/RonTwps",
    aliases: ["fb", "face", "book"],
  },
  { id: "shopee", label: "Shopee", url: "https://shopee.tw/ronlo", archived: true },
];
