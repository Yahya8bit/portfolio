"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

/** Smooth-scroll to a same-page #hash target, even when the URL hash already
 *  matches (native anchor nav is a no-op in that case). */
export function smoothScrollTo(href: string, e: MouseEvent<HTMLAnchorElement>) {
  if (!href.startsWith("#")) return;
  const el = document.getElementById(href.slice(1));
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: "smooth" });
  // keep the URL hash in sync without pushing a new history entry
  history.replaceState(null, "", href);
}

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

/** Anchor that always scrolls to its in-page target on click (repeatable). */
export default function AnchorLink({ href, children, onClick, ...rest }: Props) {
  return (
    <a
      href={href}
      onClick={(e) => {
        smoothScrollTo(href, e);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
