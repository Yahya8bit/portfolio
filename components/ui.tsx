import type { ReactNode } from "react";
import AnchorLink from "@/components/AnchorLink";

/** Section heading with a trailing cyan accent period, e.g. "Projects." */
export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink">
      {children}
      <span className="text-accent">.</span>
    </h2>
  );
}

type PillProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "outline";
  download?: boolean;
};

/** Rounded pill button: blue→cyan gradient (primary) or white with thin dark border (outline). */
export function PillButton({
  children,
  href,
  variant = "primary",
  download = false,
}: PillProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-colors";
  const styles =
    variant === "primary"
      ? "bg-linear-to-r from-blue to-cyan text-white hover:opacity-90"
      : "bg-white text-ink border border-ink/20 hover:border-ink/50 dark:bg-white/5";
  return (
    <AnchorLink
      href={href}
      download={download || undefined}
      className={`${base} ${styles}`}
    >
      {children}
    </AnchorLink>
  );
}
