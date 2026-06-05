import Reveal from "@/components/Reveal";
import { SectionTitle } from "@/components/ui";

const columns = [
  {
    header: "Languages",
    items: ["Python", "C / C++", "Java"],
  },
  {
    header: "Databases & Systems",
    items: ["SQL / NoSQL", "Linux / Unix"],
  },
  {
    header: "Spoken Languages",
    items: ["French", "English", "Arabic"],
  },
  {
    header: "Interests",
    items: [
      "Competitive Programming",
      "AI / ML",
      "Chess",
      "Sport",
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <Reveal>
        <SectionTitle>Skills</SectionTitle>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((col, i) => (
          <Reveal key={col.header} delay={i * 0.1}>
            <div className="h-full rounded-[20px] border border-ink/10 bg-white/50 p-6 dark:bg-white/[0.03]">
              <h3 className="text-lg font-bold text-ink">{col.header}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {col.items.map((it) => (
                  <li key={it}>
                    <span className="inline-block whitespace-nowrap rounded-full border border-blue/20 bg-blue/10 px-3 py-1.5 text-sm font-medium text-ink/80">
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
