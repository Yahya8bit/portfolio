import { Code, Database, Globe, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";
import { SectionTitle } from "@/components/ui";

const columns = [
  {
    header: "Languages",
    Icon: Code,
    items: ["Python", "C / C++", "Java"],
  },
  {
    header: "Databases & Systems",
    Icon: Database,
    items: ["SQL / NoSQL", "Linux / Unix"],
  },
  {
    header: "Spoken Languages",
    Icon: Globe,
    items: ["French", "English", "Arabic"],
  },
  {
    header: "Interests",
    Icon: Sparkles,
    items: ["Competitive Programming", "AI / ML", "Chess", "Sport"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
      <Reveal>
        <SectionTitle>Skills</SectionTitle>
      </Reveal>

      {/*
        Equal-height cards: the grid's default `align-items: stretch` makes every
        grid item fill the full height of its row (= the tallest card). For that
        to reach the card, the whole chain must be full-height: the Reveal wrapper
        gets `h-full` (so the stretched grid item passes its height down) and the
        card is `h-full` too. So even though "Interests" has more chips, all four
        cards match its height instead of each shrinking to its own content.
      */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((col, i) => (
          <Reveal key={col.header} delay={i * 0.1} className="h-full">
            <div className="h-full rounded-[20px] border border-ink/10 bg-white/50 p-6 dark:bg-white/[0.03]">
              <h3 className="flex items-center gap-2 text-lg font-bold text-ink">
                <col.Icon size={18} className="text-blue" aria-hidden />
                {col.header}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {col.items.map((it) => (
                  <li key={it}>
                    <span className="inline-block whitespace-nowrap rounded-full border border-blue/20 bg-blue/10 px-3 py-1.5 text-sm font-medium text-ink/80 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue/20">
                      {it}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
