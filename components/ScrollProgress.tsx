"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollProgress() {
  const [pct, setPct] = useState(0);
  const rafRef = useRef<number>(0);
  const reducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    function update() {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      setPct(scrollable > 0 ? (el.scrollTop / scrollable) * 100 : 0);
    }

    function onScroll() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "3px",
        width: `${pct}%`,
        zIndex: 60,
        background: "linear-gradient(to right, #1565c0, #29b6e8)",
        transition: reducedMotion ? "none" : "width 0.1s linear",
      }}
    />
  );
}
