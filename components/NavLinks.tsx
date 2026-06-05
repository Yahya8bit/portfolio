"use client";

import { useEffect, useState } from "react";
import AnchorLink from "@/components/AnchorLink";

const links = [
  { label: "Home", id: "home" },
  { label: "Projects", id: "projects" },
  { label: "Education", id: "education" },
  { label: "Activities", id: "activities" },
  { label: "Skills", id: "skills" },
  { label: "About", id: "story" },
  { label: "Contact", id: "contact" },
];

/** Centered nav links with scroll-spy: the section currently in view is
 *  highlighted in the blue accent. */
export default function NavLinks() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      // trigger when a section sits roughly in the vertical middle of the viewport
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    links.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <ul className="hidden items-center gap-5 justify-self-center lg:flex">
      {links.map((l) => (
        <li key={l.id}>
          <AnchorLink
            href={`#${l.id}`}
            className={`text-[15px] font-medium transition-colors hover:text-accent ${
              active === l.id ? "text-blue" : "text-ink/70"
            }`}
            aria-current={active === l.id ? "page" : undefined}
          >
            {l.label}
          </AnchorLink>
        </li>
      ))}
    </ul>
  );
}
