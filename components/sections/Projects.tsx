import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { SectionTitle } from "@/components/ui";

type Project = {
  title: string;
  desc: string;
  lang: string;
  href: string;
  featured?: boolean;
};

const projects: Project[] = [
  {
    title: "Zitouna.ai",
    desc: "AI platform helping Tunisian SMEs analyze sales in real time and auto-generate marketing campaigns with fast LLMs.",
    lang: "Python",
    href: "https://github.com/Yahya8bit/Zitouna.ai",
    featured: true,
  },
  // TODO: CF-Tracker has no README — description inferred from repo name + Python codebase; refine with the real summary.
  {
    title: "CF-Tracker",
    desc: "A Codeforces progress tracker built in Python.",
    lang: "Python",
    href: "https://github.com/Yahya8bit/CF-Tracker",
  },
  {
    title: "calculator-l-ilef",
    desc: "A web calculator built with vanilla HTML, CSS, and JavaScript.",
    lang: "JavaScript",
    href: "https://github.com/Yahya8bit/calculator-l-ilef",
  },
];

function Ribbon() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute -left-6 top-6 w-[120%] opacity-70"
      viewBox="0 0 400 120"
      fill="none"
    >
      <path
        d="M0 60 C 60 0, 120 120, 200 60 S 340 0, 400 60"
        stroke="#1565c0"
        strokeWidth="22"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <Reveal>
        <SectionTitle>Projects</SectionTitle>
      </Reveal>

      <div className="mt-12 grid gap-10 sm:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.1}>
            <article>
              <div className="relative overflow-hidden rounded-[20px] bg-zinc-100 p-6 dark:bg-white/5">
                <Ribbon />
                {/* TODO: styled fallback — swap in a real screenshot of the project */}
                <div className="relative flex aspect-[4/3] flex-col items-center justify-center gap-3 overflow-hidden rounded-xl bg-linear-to-br from-blue/15 to-cyan/15 p-6 shadow-lg">
                  <span className="font-mono text-2xl font-bold tracking-tight text-ink">
                    {p.title}
                  </span>
                  <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-blue dark:bg-white/10 dark:text-cyan">
                    {p.lang}
                  </span>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <h3 className="text-xl font-bold text-ink">{p.title}</h3>
                {p.featured && (
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-white">
                    Featured
                  </span>
                )}
                <Link
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${p.title} on GitHub`}
                  className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white transition-transform hover:scale-110"
                >
                  <ArrowUpRight size={15} />
                </Link>
              </div>
              <p className="mt-1.5 text-ink/60">{p.desc}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
