import type { Graph } from "schema-dts";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { BIO, PERSON, SCHOOLS, SITE_URL } from "@/lib/identity";

const PERSON_ID = `${SITE_URL}/#person`;
const ORG_ID = `${SITE_URL}/#prinsur`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function PersonJsonLd({ locale }: { locale: Locale }) {
  const isZh = locale === "zh-TW";
  const pageUrl = SITE_URL + getPathname({ locale, href: "/" });

  const graph: Graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl}#profilepage`,
        url: pageUrl,
        inLanguage: locale,
        dateModified: new Date().toISOString(),
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": PERSON_ID },
        mainEntity: { "@id": PERSON_ID },
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: isZh ? PERSON.nameZh : PERSON.nameEn,
        alternateName: [isZh ? PERSON.nameEn : PERSON.nameZh, ...PERSON.romanizations],
        url: SITE_URL,
        image: PERSON.image,
        description: isZh ? BIO.zh : BIO.en,
        jobTitle: isZh ? PERSON.jobTitle.zh : PERSON.jobTitle.en,
        worksFor: { "@id": ORG_ID },
        alumniOf: Object.values(SCHOOLS).map((school) => ({
          "@type": "EducationalOrganization" as const,
          name: school.name,
          alternateName: school.nameZh,
          url: school.url,
        })),
        knowsAbout: [...PERSON.knowsAbout],
        knowsLanguage: [...PERSON.knowsLanguage],
        nationality: { "@type": "Country", name: "Taiwan" },
        sameAs: [...PERSON.sameAs],
      },
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: PERSON.worksFor.name,
        alternateName: PERSON.worksFor.nameZh,
        url: PERSON.worksFor.url,
        founder: { "@id": PERSON_ID },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: "Ronald Luo 羅永能",
        inLanguage: ["en", "zh-TW"],
        publisher: { "@id": PERSON_ID },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
