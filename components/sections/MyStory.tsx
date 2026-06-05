import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { SectionTitle } from "@/components/ui";

function AccentLink({ children }: { children: React.ReactNode }) {
  return (
    <Link href="#" className="font-medium text-blue underline-offset-2 hover:underline">
      {children}
    </Link>
  );
}

export default function MyStory() {
  return (
    <section id="story" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionTitle>My Story</SectionTitle>
        </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-10 grid gap-8 sm:grid-cols-[220px_1fr] sm:gap-10">
          <Image
            src="/projects/supcom.jpeg"
            alt="At a university campus event"
            width={300}
            height={400}
            className="h-72 w-full rounded-[20px] object-cover object-top sm:h-full sm:max-h-[420px]"
          />
          <div className="space-y-6 text-lg leading-relaxed text-ink/70">
          <p>
            My path started with a love for{" "}
            <AccentLink>mathematics</AccentLink>, which led me to a Baccalauréat
            in Mathematics and then two years of intensive preparatory studies
            at <AccentLink>IPEIM</AccentLink> in Monastir.
          </p>
          <p>
            Today I&apos;m a first-year computer engineering student at{" "}
            <AccentLink>ENSI</AccentLink> in Manouba, building on that foundation
            with algorithms, programming, databases, and systems.
          </p>
          <p>
            I sharpen my problem-solving through the{" "}
            <AccentLink>ENSI CPC</AccentLink> competitive programming club,
            training under time pressure and competing in contests like{" "}
            <AccentLink>TCPC 2026</AccentLink>.
          </p>
          <p>
            I&apos;m also exploring AI and machine learning with the{" "}
            <AccentLink>ORBYX</AccentLink> club, getting hands-on with the
            fundamentals of data science and AI.
          </p>
          <p>
            Serious, motivated, and a reliable teammate, I&apos;m always looking
            to grow my technical skills and take on new challenges.
          </p>
          </div>
        </div>
      </Reveal>
      </div>
    </section>
  );
}
