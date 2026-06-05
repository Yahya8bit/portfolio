"use client";

import { useState } from "react";
import { Check, GraduationCap, MapPin } from "lucide-react";
import Reveal from "@/components/Reveal";
import { SectionTitle } from "@/components/ui";

const schools = [
  {
    school: "ENSI, Manouba",
    degree: "Computer Engineering Cycle",
    dates: "Sept 2025 — Present",
    location: "Manouba, Tunisia",
    points: [
      "First year of the engineering cycle at the National School of Computer Science (ENSI).",
      "Member of ENSI CPC (Competitive Programming Club) and ORBYX (AI/ML club).",
      "Studying algorithms, programming, databases, and systems.",
    ],
  },
  {
    school: "IPEIM, Monastir",
    degree: "Preparatory Studies for Engineering",
    dates: "Sept 2023 — June 2025",
    location: "Monastir, Tunisia",
    points: [
      "Two-year intensive preparatory program in mathematics and physics.",
      "Built strong foundations in mathematics, physics, and algorithmic thinking.",
      "Admitted to ENSI through the national engineering entrance competition.",
    ],
  },
  {
    school: "Lycée les Élites, Sousse",
    degree: "Baccalauréat in Mathematics",
    dates: "Sept 2022 — June 2023",
    location: "Sousse, Tunisia",
    points: [
      "Mathematics track with a strong focus on math and the sciences.",
      "Graduated in 2023 before joining preparatory studies.",
    ],
  },
];

export default function Education() {
  const [active, setActive] = useState(0);
  const item = schools[active];

  return (
    <section id="education" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <Reveal>
        <SectionTitle>Education</SectionTitle>
      </Reveal>

      <div className="mt-12 grid gap-10 md:grid-cols-[220px_1fr]">
        <ul className="flex overflow-x-auto border-l border-ink/15 md:flex-col md:overflow-visible">
          {schools.map((s, i) => (
            <li key={s.school}>
              <button
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={`-ml-px whitespace-nowrap border-l-2 px-5 py-3 text-left text-sm font-medium transition-colors ${
                  i === active
                    ? "border-blue text-blue"
                    : "border-transparent text-ink/55 hover:text-ink"
                }`}
              >
                {s.school}
              </button>
            </li>
          ))}
        </ul>

        <div className="rounded-[20px] border border-ink/10 bg-white/50 p-7 dark:bg-white/[0.03]">
          <div className="flex items-center gap-2.5">
            <GraduationCap size={22} className="shrink-0 text-blue" aria-hidden />
            <h3 className="text-xl font-bold sm:text-2xl">
              {item.degree}{" "}
              <span className="text-blue">@ {item.school}</span>
            </h3>
          </div>
          <p className="mt-2 font-semibold text-ink/70">{item.dates}</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink/55">
            <MapPin size={14} className="text-blue" aria-hidden />
            {item.location}
          </p>
          <ul className="mt-6 space-y-3">
            {item.points.map((pt) => (
              <li key={pt} className="flex gap-3 text-ink/75">
                <Check
                  size={20}
                  className="mt-0.5 shrink-0 text-accent"
                  aria-hidden
                />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
