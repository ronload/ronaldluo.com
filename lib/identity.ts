import { SOCIAL_LINKS } from "@/lib/socials";

export const SITE_URL = "https://ronaldluo.com";

export const LAST_UPDATED = "2026-06-21";

export const PERSON = {
  nameEn: "Ronald Luo",
  nameZh: "羅永能",
  romanizations: ["Luo Yong Neng", "Luo Yong-neng", "Luo Yongneng"],
  jobTitle: {
    en: "Co-Founder, Board Director & CTO",
    zh: "共同創辦人、董事及技術長",
  },
  worksFor: {
    name: "Prinsur Tech CO., LTD.",
    nameZh: "鈦溪科技股份有限公司",
    url: "https://prinsur.com",
  },
  alumniOf: [
    {
      name: "Fu Jen Catholic University",
      nameZh: "天主教輔仁大學",
      url: "https://www.fju.edu.tw",
    },
    {
      name: "Taipei Municipal Jianguo High School",
      nameZh: "台北市立建國高級中學",
      url: "https://www.ck.tp.edu.tw",
    },
  ],
  knowsAbout: [
    "Software Engineering",
    "Web Development",
    "Frontend Development",
    "Product Design",
    "Engineering Leadership",
  ],
  knowsLanguage: ["zh-Hant", "en"],
  nationality: "TW",
  image: `${SITE_URL}/avatar.jpg`,
  email: "ronald@ronaldluo.com",
  sameAs: SOCIAL_LINKS.filter((social) => !social.archived).map((social) => social.url),
} as const;

export const BIO = {
  en: "Ronald Luo (羅永能) is the Co-Founder, Board Director and CTO of Prinsur Tech (Prinsur Tech CO., LTD.), a software developer based in Taiwan who studied at Fu Jen Catholic University and Taipei Municipal Jianguo High School.",
  zh: "羅永能（Ronald Luo）是鈦溪科技股份有限公司（Prinsur Tech）的共同創辦人、董事及技術長，一位來自台灣的軟體開發者，曾就讀天主教輔仁大學與台北市立建國高級中學。",
};
