import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import Reveal from "@/components/Reveal";
import { SectionTitle } from "@/components/ui";

type Project = {
  title: string;
  desc: string;
  tags: string[];
  image: string;
  liveHref?: string;
  repoHref?: string;
  featured?: boolean;
};

const projects: Project[] = [
  {
    title: "P-Guard-Monitor",
    desc: "Real-time robot patrol monitoring dashboard with stat cards, live charts, alerts feed, and map view.",
    tags: ["React", "Typescript", "FastAPI","PostgreSQL"],
    image: "/projects/pguard.webp",
    liveHref: "https://p-guard-monitor.vercel.app/",
    repoHref: "https://github.com/Yahya8bit/P-Guard-Monitor",
    featured: true,
  },
  {
    title: "G&Y Sole",
    desc: "Sneaker e-commerce storefront with an editorial split-hero and smooth shopping experience.",
    tags: ["React", "Tailwind CSS", "PHP", "MySQL"],
    image: "/projects/gysole.webp",
    liveHref: "https://gy-sole.vercel.app",
    repoHref: "https://github.com/Yahya8bit/Projet-web",
  },
  {
    title: "ENSI Orientation",
    desc: "Orientation and landing site for ENSI with carousel hero, admission, student-life, and curriculum sections.",
    tags: ["HTML","CSS","JS"],
    image: "/projects/ensi.webp",
    liveHref: "https://ensi-guide-orientation.tech/",
    repoHref: "https://github.com/Yahya8bit/ENSI-Orientation",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <Reveal>
        <SectionTitle>Projects</SectionTitle>
      </Reveal>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => {
          const href = p.liveHref ?? p.repoHref ?? "#";
          return (
            <Reveal key={p.title} delay={i * 0.1}>
              <article className="group flex flex-col rounded-[20px] border border-ink/10 bg-white/50 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue/40 hover:shadow-[0_8px_32px_-4px_rgba(21,101,192,0.18)] dark:bg-white/[0.03]">
                {/* Screenshot preview */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-t-[20px] bg-ink/5">
                  <Image
                    src={p.image}
                    alt={`${p.title} screenshot`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-top"
                  />
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-ink">{p.title}</h3>
                        {p.featured && (
                          <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-white">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {p.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-blue/20 bg-blue/10 px-2.5 py-0.5 text-xs font-medium text-blue dark:text-cyan"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${p.title}`}
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-all hover:scale-110 hover:bg-blue/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/60"
                    >
                      <ArrowUpRight size={15} />
                    </Link>
                  </div>

                  <p className="text-sm leading-relaxed text-ink/70">{p.desc}</p>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.3}>
        <div className="mt-10 text-center">
          <Link
            href="https://github.com/Yahya8bit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-2.5 text-sm font-semibold text-ink/70 transition-all hover:border-blue/40 hover:text-blue dark:hover:text-cyan"
          >
            <Github size={15} />
            More on GitHub
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
