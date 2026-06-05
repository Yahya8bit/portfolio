"use client";

import { useEffect, useRef } from "react";

/**
 * Subtle animated network of connected dots behind the ENTIRE page — echoes the
 * ENSI connected-diamond motif / graphs in CS. One fixed, full-viewport canvas
 * at the lowest z-index, behind all sections. Faint so text stays readable.
 * Respects prefers-reduced-motion (renders one static frame, no animation).
 */
export default function NodeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const LINK_DIST = 190;
    // colors come from CSS vars so they flip with the .dark theme
    let dotRGB = "21, 101, 192";
    let lineRGB = "41, 182, 232";
    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      dotRGB = cs.getPropertyValue("--graph-dot").trim() || dotRGB;
      lineRGB = cs.getPropertyValue("--graph-line").trim() || lineRGB;
    };

    type Node = { x: number; y: number; vx: number; vy: number };
    let nodes: Node[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const seed = () => {
      // cap the dot count so it stays lightweight on large viewports
      const count = Math.min(105, Math.max(60, Math.round((w * h) / 14000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      }));
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduce) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.25;
            ctx.strokeStyle = `rgba(${lineRGB}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.fillStyle = `rgba(${dotRGB}, 0.4)`;
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x <= 0 || n.x >= w) n.vx *= -1;
        if (n.y <= 0 || n.y >= h) n.vy *= -1;
        n.x = Math.max(0, Math.min(w, n.x));
        n.y = Math.max(0, Math.min(h, n.y));
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    // re-read colors when the .dark class on <html> changes (theme toggle)
    const themeObserver = new MutationObserver(() => {
      readColors();
      if (reduce) draw();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("resize", resize);
    readColors();
    resize();
    if (!reduce) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
