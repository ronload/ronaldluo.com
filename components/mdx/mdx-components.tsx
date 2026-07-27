import Image, { type ImageProps } from "next/image";
import type { ComponentProps } from "react";
import { CodeBlock } from "@/components/mdx/code-block";
import { Link } from "@/i18n/navigation";

function MdxImage({ alt, height, src, width, ...props }: ComponentProps<"img">) {
  if (!src) return null;

  return (
    <Image
      {...props}
      alt={alt ?? ""}
      className="my-6 h-auto w-full rounded-xl border"
      height={height === undefined ? undefined : Number(height)}
      sizes="(min-width: 112.5rem) 69rem, (min-width: 58rem) 53rem, 100vw"
      src={src as ImageProps["src"]}
      width={width === undefined ? undefined : Number(width)}
    />
  );
}

function MdxLink({ href, ...props }: ComponentProps<"a">) {
  if (!href) return <a {...props} />;
  if (/^(https?:)?\/\//i.test(href)) {
    return <a href={href} rel="noreferrer" target="_blank" {...props} />;
  }
  if (/^#|^[a-z][a-z\d+.-]*:/i.test(href)) return <a href={href} {...props} />;

  return <Link href={href} {...props} />;
}

export function mdxComponents(labels: { copy: string; copied: string }) {
  return {
    a: MdxLink,
    img: MdxImage,
    pre: (props: ComponentProps<"pre">) => (
      <CodeBlock {...props} copiedLabel={labels.copied} copyLabel={labels.copy} />
    ),
  };
}
