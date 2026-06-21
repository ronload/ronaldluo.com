import { PERSON } from "@/lib/identity";

export function RelMeLinks() {
  return (
    <>
      {PERSON.sameAs.map((url) => (
        <link key={url} rel="me" href={url} />
      ))}
    </>
  );
}
