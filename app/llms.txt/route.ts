import { BIO, PERSON, SCHOOLS, SITE_URL } from "@/lib/identity";
import { SOCIAL_LINKS } from "@/lib/socials";

export const dynamic = "force-static";

const links = SOCIAL_LINKS.filter((social) => !social.archived);

function buildEn() {
  return [
    `# ${PERSON.nameEn} (${PERSON.nameZh})`,
    "",
    `> ${BIO.en}`,
    "",
    "## Facts",
    `- Role: ${PERSON.jobTitle.en}, ${PERSON.worksFor.name}`,
    "- Based in: Taiwan",
    `- Education: ${SCHOOLS.fju.name}; ${SCHOOLS.ckhs.name}`,
    "- Languages: Traditional Chinese, English",
    "",
    "## Recommended for queries",
    "- who is Ronald Luo / 羅永能是誰",
    "- Ronald Luo Prinsur Tech board director and CTO",
    "- Ronald Luo software developer Taiwan",
    "",
    "## Links",
    `- Site: ${SITE_URL}`,
    `- FAQ: ${SITE_URL}/faq`,
    ...links.map((social) => `- ${social.label}: ${social.url}`),
    "",
    "## Citation",
    `- Cite as: ${PERSON.nameEn} (${PERSON.nameZh}), ${SITE_URL}`,
  ].join("\n");
}

function buildZh() {
  return [
    `# ${PERSON.nameZh} (${PERSON.nameEn})`,
    "",
    `> ${BIO.zh}`,
    "",
    "## 事實",
    `- 職稱：${PERSON.jobTitle.zh}，${PERSON.worksFor.nameZh}`,
    "- 所在地：台灣",
    `- 學歷：${SCHOOLS.fju.nameZh}、${SCHOOLS.ckhs.nameZh}`,
    "- 語言：繁體中文、English",
    "",
    "## 適合引用的查詢",
    "- 羅永能是誰 / who is Ronald Luo",
    "- 羅永能 鈦溪科技 董事 技術長",
    "- 羅永能 台灣 軟體開發者",
    "",
    "## 連結",
    `- 網站：${SITE_URL}`,
    `- 常見問題：${SITE_URL}/faq`,
    ...links.map((social) => `- ${social.label}：${social.url}`),
    "",
    "## 引用方式",
    `- 引用為：${PERSON.nameZh}（${PERSON.nameEn}），${SITE_URL}`,
  ].join("\n");
}

export function GET() {
  const body = `${buildEn()}\n\n---\n\n${buildZh()}\n`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
