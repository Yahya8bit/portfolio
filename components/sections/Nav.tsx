import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import NavLinks from "@/components/NavLinks";
import AnchorLink from "@/components/AnchorLink";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-white/90 shadow-sm backdrop-blur-md dark:bg-[#0b1220]/90">
      <nav className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center py-5">
        <AnchorLink
          href="#home"
          aria-label="Mohamed Yahia Gazzeh — home"
          className="flex items-center justify-self-start"
        >
          {/* gray monogram in light mode */}
          <Image
            src="/myg-logo-original.png"
            alt="Mohamed Yahia Gazzeh logo"
            width={309}
            height={266}
            priority
            className="h-10 w-auto object-contain dark:hidden"
          />
          {/* white monogram in dark mode */}
          <Image
            src="/myg-logo-white.png"
            alt=""
            aria-hidden
            width={309}
            height={266}
            priority
            className="hidden h-10 w-auto object-contain dark:block"
          />
        </AnchorLink>

        <NavLinks />

        <div className="flex items-center gap-2.5 justify-self-end">
          <Link
            href="/resume.pdf"
            download
            className="hidden items-center gap-2 rounded-full border border-ink/20 bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink/50 dark:bg-white/5 sm:inline-flex"
          >
            <Download size={16} /> Download CV
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
