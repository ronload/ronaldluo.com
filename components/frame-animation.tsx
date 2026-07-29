"use client";

import { usePathname } from "next/navigation";

interface FrameAnimationProps {
  className: string;
  children?: React.ReactNode;
}

export function FrameAnimation({ className, children }: FrameAnimationProps) {
  const pathname = usePathname();

  return (
    <div aria-hidden className={className} key={pathname}>
      {children}
    </div>
  );
}
