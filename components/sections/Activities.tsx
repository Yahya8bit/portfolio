import Image from "next/image";
import Reveal from "@/components/Reveal";
import { SectionTitle } from "@/components/ui";

const activities = [
  {
    img: "/projects/activity-cpc.jpeg",
    title: "ENSI CPC",
    date: "2025 — Present",
    desc: "Active member, training in competitive programming.",
  },
  {
    img: "/projects/activity-tcpc.jpeg",
    title: "TCPC 2026",
    date: "2026",
    desc: "Competed in Tunisia's national collegiate programming contest.",
  },
  {
    img: "/projects/lunar_hack.jpg",
    title: "Lunar Hack",
    date: "2025",
    desc: "Participated in the hackathon.",
  },
  {
    img: "/projects/forum.jpeg",
    title: "Forum of ENSI",
    date: "2025",
    desc: "Attended the 20th annual ENSI career forum.",
  },
];

export default function Activities() {
  return (
    <section id="activities" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <Reveal>
        <SectionTitle>Activities</SectionTitle>
      </Reveal>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {activities.map((a, i) => (
          <Reveal key={a.title} delay={i * 0.1}>
            <figure className="group transition-transform duration-300 hover:-translate-y-1">
              <div className="relative h-[360px] overflow-hidden rounded-[20px] shadow-sm transition-shadow duration-300 group-hover:shadow-2xl">
                <Image
                  src={a.img}
                  alt={`${a.title} — ${a.desc}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <figcaption className="mt-4">
                <p className="text-lg font-bold text-ink">{a.title}</p>
                <p className="mt-0.5 text-xs font-semibold text-blue">{a.date}</p>
                <p className="mt-1 text-sm text-ink/60">{a.desc}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
