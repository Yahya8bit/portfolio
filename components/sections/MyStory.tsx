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
        {/*
          Two-column layout on sm+ (a 280px image column + flexible text).
          The grid uses the default `align-items: stretch`, so both columns grow
          to the full height of the row. Paired with `sm:h-full` on the image
          wrapper, the photo stretches to match the paragraph block's height —
          top and bottom edges line up with the text.
        */}
        <div className="mt-10 grid gap-8 sm:grid-cols-[280px_1fr] sm:gap-10">
          {/*
            Portrait wrapper.
            - `relative` makes this the positioning context, so the gradient
              overlay below (which is `absolute inset-0`) is sized/placed
              relative to THIS box, not the page.
            - `group` lets child elements react to hover on the wrapper
              (e.g. `group-hover:*`).
            - `overflow-hidden` + `rounded-[20px]` clip both the image and the
              zoom so nothing spills past the rounded corners.
            - `ring-2 ring-blue` is the thin blue ring, matching the hero portrait.
          */}
          <div className="group relative h-80 overflow-hidden rounded-[20px] ring-2 ring-blue sm:h-full">
            {/*
              The photo. `fill` makes it cover the wrapper.
              Hover effect: `group-hover:scale-105` is a gentle zoom, animated by
              `transition-transform duration-500` so it eases over 0.5s instead of
              snapping. (Full color by default — no grayscale filter.)
            */}
            <Image
              src="/projects/supcom.jpeg"
              alt="At a university campus event"
              fill
              sizes="(max-width: 640px) 100vw, 220px"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
            {/*
              Gradient overlay sits ON TOP of the image because it comes after it
              in the DOM and is `absolute inset-0` (stretched to all four edges of
              the relative wrapper). It shares the same stacking context, so later
              sibling = painted above. `pointer-events-none` lets clicks/hover pass
              through to the image. The gradient fades from transparent at the top
              to ~70% dark navy at the bottom, blending the photo into the theme.
            */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent to-[#0b1220]/70" />
          </div>
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
