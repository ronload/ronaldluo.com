import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function externalLinkProps(href: string) {
  return href.startsWith("http") ? ({ target: "_blank", rel: "noopener noreferrer" } as const) : {};
}

export function objectKeys<T extends object>(o: T) {
  return Object.keys(o) as (keyof T & string)[];
}
