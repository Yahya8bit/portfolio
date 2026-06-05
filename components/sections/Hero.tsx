import Image from "next/image";
import { Download } from "lucide-react";
import Reveal from "@/components/Reveal";
import { PillButton } from "@/components/ui";

export default function Hero() {
  return (
    <section id="home" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <Reveal>
          <p className="mb-4 text-base font-medium text-ink/70">
            Hey, I&apos;m Yahia <span aria-hidden>👋</span>
          </p>
          <h1 className="text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl">
            <span className="bg-linear-to-r from-blue to-cyan bg-clip-text text-transparent">
              Software
            </span>
            <br />
            <span className="text-ink">Engineering</span>
            <br />
            <span className="text-ink">Student</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/60">
            First-year software engineering student at ENSI with strong
            problem-solving skills and a solid foundation in computer science.
            Serious, motivated, and an effective team player eager to grow my
            technical and professional skills.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <PillButton href="/resume.pdf" download>
              <Download size={16} /> Download CV
            </PillButton>
            <PillButton href="#contact" variant="outline">
              Get In Touch
            </PillButton>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="flex justify-center md:justify-end">
          <div className="rounded-full p-2 ring-2 ring-accent">
            <Image
              src="/projects/ensi_forum.jpeg"
              alt="Portrait"
              width={420}
              height={420}
              priority
              className="h-80 w-80 rounded-full object-cover object-top sm:h-[26rem] sm:w-[26rem]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
