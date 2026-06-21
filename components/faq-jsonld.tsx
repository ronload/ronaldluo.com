import type { FAQPage, WithContext } from "schema-dts";
import type { Locale } from "@/i18n/routing";
import { FAQ, SITE_URL } from "@/lib/identity";

export function FaqJsonLd({ locale }: { locale: Locale }) {
  const items = locale === "zh-TW" ? FAQ.zh : FAQ.en;

  const graph: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    about: { "@id": `${SITE_URL}/#person` },
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
