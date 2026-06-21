import { SOCIAL_LINKS } from "@/lib/socials";

export const SITE_URL = "https://ronaldluo.com";

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
  knowsAbout: [
    "Software Engineering",
    "Web Development",
    "Full-Stack Development",
    "Software Architecture",
    "Software Development Lifecycle",
    "Product Design",
    "Engineering Leadership",
  ],
  knowsLanguage: ["zh-Hant", "en"],
  nationality: "TW",
  image: `${SITE_URL}/avatar.jpg`,
  email: "ronald@ronaldluo.com",
  sameAs: SOCIAL_LINKS.filter((social) => !social.archived).map((social) => social.url),
} as const;

interface School {
  name: string;
  nameZh: string;
  url: string;
  icon: string;
  brightIcon?: boolean;
}

interface Experience {
  icon: string;
  organization: string;
  roleName: string;
  startDate: string;
  endDate?: string;
}

export const EXPERIENCES: Record<"prinsur" | "kaiyn" | "yn", Experience> = {
  prinsur: {
    icon: "/prinsur-icon.png",
    organization: "Prinsur Tech CO., LTD.",
    roleName: "Co-Founder, Board Director & CTO",
    startDate: "2025",
  },
  kaiyn: {
    icon: "/kaiyn-capital-icon.jpg",
    organization: "Kaiyn Capital",
    roleName: "Co-Founder & Community Manager",
    startDate: "2023",
    endDate: "2025",
  },
  yn: {
    icon: "/yn-official-icon.jpg",
    organization: "YN OFFICIAL",
    roleName: "Founder",
    startDate: "2019",
    endDate: "2025",
  },
};

export const SCHOOLS: Record<"fju" | "ckhs", School> = {
  fju: {
    name: "Fu Jen Catholic University",
    nameZh: "天主教輔仁大學",
    url: "https://www.fju.edu.tw",
    icon: "/fju-icon.jpg",
  },
  ckhs: {
    name: "Taipei Municipal Jianguo High School",
    nameZh: "台北市立建國高級中學",
    url: "https://www.ck.tp.edu.tw",
    icon: "/ckhs-icon.png",
    brightIcon: true,
  },
};

export const BIO = {
  en: "Ronald Luo (羅永能) is the Co-Founder, Board Director and CTO of Prinsur Tech (Prinsur Tech CO., LTD.), a software developer based in Taiwan who studied at Fu Jen Catholic University and Taipei Municipal Jianguo High School.",
  zh: "羅永能（Ronald Luo）是鈦溪科技股份有限公司（Prinsur Tech）的共同創辦人、董事及技術長，一位來自台灣的軟體開發者，曾就讀天主教輔仁大學與台北市立建國高級中學。",
};

export const FAQ = {
  en: [
    {
      question: "Who is Ronald Luo?",
      answer: BIO.en,
    },
    {
      question: "What is Prinsur Tech?",
      answer:
        "Prinsur Tech (Prinsur Tech CO., LTD.) is a software company co-founded by Ronald Luo (羅永能), where he serves as Board Director and CTO, leading its technical strategy, product design, and engineering direction.",
    },
    {
      question: "Where did Ronald Luo study?",
      answer:
        "Ronald Luo studied Computer Science and Information Engineering at Fu Jen Catholic University, after graduating from Taipei Municipal Jianguo High School.",
    },
  ],
  zh: [
    {
      question: "羅永能是誰？",
      answer: BIO.zh,
    },
    {
      question: "Prinsur Tech（鈦溪科技）是什麼？",
      answer:
        "鈦溪科技股份有限公司（Prinsur Tech）是由羅永能（Ronald Luo）共同創辦的軟體公司，他在公司擔任董事及技術長，主導技術策略、產品設計與工程發展方向。",
    },
    {
      question: "羅永能在哪裡就學？",
      answer: "羅永能畢業於天主教輔仁大學資訊工程學系，先前就讀台北市立建國高級中學。",
    },
  ],
} as const;
