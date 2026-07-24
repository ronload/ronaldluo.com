import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { PersonJsonLd } from "@/components/person-jsonld";
import { assertLocale } from "@/i18n/assert-locale";
import { ConnectFooter } from "./_components/connect-footer";
import { EducationSection } from "./_components/education-section";
import { ExperienceSection } from "./_components/experience-section";
import { HeroSection } from "./_components/hero-section";

interface Props {
  params: Promise<{ locale: string }>;
}

export default function Home({ params }: Props) {
  const { locale } = use(params);
  assertLocale(locale);
  setRequestLocale(locale);

  return (
    <>
      <PersonJsonLd locale={locale} />
      <HeroSection />
      <ExperienceSection />
      <EducationSection />
      <ConnectFooter />
    </>
  );
}
