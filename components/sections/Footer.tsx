import Reveal from "@/components/Reveal";
import AnchorLink from "@/components/AnchorLink";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Activities", href: "#activities" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#story" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer id="footer" className="mx-auto w-full max-w-6xl px-6 py-10">
      <Reveal>
        <div className="flex flex-col items-center gap-5 text-center">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {navLinks.map((l) => (
              <li key={l.label}>
                <AnchorLink
                  href={l.href}
                  className="text-sm font-medium text-ink/65 transition-colors hover:text-accent"
                >
                  {l.label}
                </AnchorLink>
              </li>
            ))}
          </ul>

          <p className="text-sm text-ink/50">
            © 2026 All Rights Reserved. Made with{" "}
            <span aria-hidden>💙</span> by Mohamed Yahia Gazzeh
          </p>
        </div>
      </Reveal>
    </footer>
  );
}
