"use client";

import { useState } from "react";
import { Sun, Moon } from "lucide-react";

/** Dark/light toggle. Defaults to dark (html has `dark` class on the server).
 *  Choice is held in React state for the session. */
export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink/80 transition-colors hover:border-accent hover:text-accent"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
