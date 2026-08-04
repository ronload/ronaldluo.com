import type { BlogPosting, WithContext } from "schema-dts";
import { SITE_URL } from "@/lib/identity";

interface Props {
  url: string;
  title: string;
  description: string;
  date: string;
  modified?: string;
  locale: string;
  keywords: string[];
}

export function NoteJsonLd({ url, title, description, date, modified, locale, keywords }: Props) {
  const graph: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: title,
    description,
    datePublished: date,
    dateModified: modified ?? date,
    inLanguage: locale,
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    ...(keywords.length > 0 ? { keywords } : {}),
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
      type="application/ld+json"
    />
  );
}
