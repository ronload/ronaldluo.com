import {
  SiFacebook,
  SiGithub,
  SiInstagram,
  SiShopee,
  SiThreads,
  SiX,
} from "@icons-pack/react-simple-icons";
import { Mail } from "lucide-react";
import type { ComponentType } from "react";
import { LinkedinIcon } from "@/components/linkedin-icon";
import { PERSON } from "@/lib/identity";
import { SOCIAL_LINKS } from "@/lib/socials";

type IconType = ComponentType<{ className?: string }>;

const ICONS: Record<string, IconType> = {
  github: SiGithub,
  linkedin: LinkedinIcon,
  x: SiX,
  instagram: SiInstagram,
  threads: SiThreads,
  facebook: SiFacebook,
  shopee: SiShopee,
};

export interface ContactChannel {
  label: string;
  href: string;
  icon: IconType;
  note?: string;
}

export const CONTACT_CHANNELS: ContactChannel[] = [
  { label: "Email", href: `mailto:${PERSON.email}`, icon: Mail },
  ...SOCIAL_LINKS.map((social) => ({
    label: social.label,
    href: social.url,
    icon: ICONS[social.id],
    note: social.archived ? "(archived)" : undefined,
  })),
];

export const ACTIVE_CHANNELS = CONTACT_CHANNELS.filter((channel) => !channel.note);
