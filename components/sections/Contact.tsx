"use client";

import { useState } from "react";
import Link from "next/link";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import Reveal from "@/components/Reveal";
import { SectionTitle } from "@/components/ui";

const EMAIL = "mohamedyahia.gazzah@ensi-uma.tn";
const FORMSPREE = "https://formspree.io/f/maqznkbd";

const inputClass =
  "w-full rounded-[14px] border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-ink/40 outline-none transition-colors focus:border-blue dark:bg-white/5";

type Status = "idle" | "sending" | "ok" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("ok");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <SectionTitle>Contact</SectionTitle>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-4 text-lg text-ink/70">
            Have a project, question, or opportunity? Drop me a message and
            I&apos;ll get back to you.
          </p>

          {status === "ok" ? (
            <p className="mt-8 rounded-[16px] border border-blue/30 bg-blue/10 p-5 font-medium text-blue">
              Thanks! Your message has been sent — I&apos;ll reply soon.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Name"
                  className={inputClass}
                />
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Email"
                  className={inputClass}
                />
              </div>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Message"
                className={inputClass}
              />
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-blue to-cyan px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : "Send Message"}
                </button>
                {status === "error" && (
                  <p className="text-sm text-red-500">
                    Something went wrong. Please try again or email me directly.
                  </p>
                )}
              </div>
            </form>
          )}

          {/* fallback contact links */}
          <div className="mt-8 flex flex-wrap gap-5 text-sm text-ink/70">
            <Link
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-accent"
            >
              <Mail size={16} /> {EMAIL}
            </Link>
            <Link
              href="https://www.linkedin.com/in/yahya-gazzeh-348328305/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-accent"
            >
              <Linkedin size={16} /> LinkedIn
            </Link>
            <Link
              href="https://github.com/Yahya8bit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-accent"
            >
              <Github size={16} /> GitHub
            </Link>
            <span className="inline-flex items-center gap-2">
              <MapPin size={16} className="text-accent" /> Kalaa Sghira, Sousse,
              Tunisia
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
