import Image from "next/image";
import Reveal from "@/components/Reveal";
import { SectionTitle } from "@/components/ui";

const activities = [
  {
    img: "/projects/activity-cpc.jpeg",
    title: "ENSI CPC",
    sub: "Competitive Programming Club",
  },
  {
    img: "/projects/activity-tcpc.jpeg",
    title: "TCPC 2026",
    sub: "Tunisian Collegiate Programming Contest",
  },
  {
    img: "/projects/lunar_hack.jpg",
    title: "Lunar Hack",
    sub: "Hackathon",
  },
  {
    img: "/projects/forum.jpeg",
    title: "Forum of ENSI",
    sub: "20th annual edition",
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
            <figure className="group">
              <div className="relative h-[360px] overflow-hidden rounded-[20px]">
                <Image
                  src={a.img}
                  alt={`${a.title} — ${a.sub}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <figcaption className="mt-4">
                <p className="text-lg font-bold text-ink">{a.title}</p>
                <p className="text-sm text-ink/60">{a.sub}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
