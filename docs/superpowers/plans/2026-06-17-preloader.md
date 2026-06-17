# Preloader (Anime Energy Charge) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-screen anime-style "energy charge" preloader that covers first paint and exits with a white beam-flash once the page loads (minimum 2.5s).

**Architecture:** Single `components/Preloader.tsx` client component — inline SVG warrior silhouette, Canvas 2D particle system behind it, Framer Motion AnimatePresence for overlay lifecycle. Progress = max(elapsed/2500, window-load fraction). State machine: `charging → charged → firing → done`. Mounted in `app/layout.tsx` above all content.

**Tech Stack:** Next.js 16 App Router, TypeScript, Framer Motion v12, Canvas 2D API, SVG, Tailwind CSS v4

## Global Constraints

- No new npm dependencies
- Colors: bg `#0b1220`, blue `#1565c0`, cyan `#29b6e8`, white `#ffffff` — matches site palette
- Tailwind CSS v4: no `tailwind.config.js`; any new keyframes go in `globals.css` `@theme`
- All `window`/`document` access inside `useEffect` only — SSR safe
- Minimum display: 2.5s regardless of load speed
- Exit: white beam flash (opacity 0→1 in 80ms) then beam fades out revealing page
- Reduced motion: static SVG + `<progress>` bar + simple opacity fade, no shake/particles/beam
- Warrior silhouette is original — no Dragon Ball/Goku likeness

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `components/Preloader.tsx` | Create | Entire preloader — state machine, SVG, canvas, Framer Motion |
| `app/layout.tsx` | Modify | Mount `<Preloader />` as first child of `<body>` |

---

### Task 1: Shell — state machine, progress tracking, scroll lock, layout integration

**Files:**
- Create: `components/Preloader.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `export default function Preloader(): JSX.Element | null`

- [ ] **Step 1: Create `components/Preloader.tsx`**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type Phase = 'charging' | 'charged' | 'firing' | 'done';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  radius: number;
  hue: number;
}

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>('charging');
  const [progress, setProgress] = useState(0); // 0–1
  const progressRef = useRef(0);
  const phaseRef = useRef<Phase>('charging');
  const prefersReducedMotion = useReducedMotion();
  const startTimeRef = useRef<number | null>(null);
  const loadedRef = useRef(false);
  const tickRafRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const beamFiredRef = useRef(false);

  // Keep phaseRef in sync
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Progress tracking + scroll lock
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const MIN_MS = 2500;
    startTimeRef.current = performance.now();

    function maybeAdvance(elapsed: number) {
      if (elapsed >= MIN_MS && loadedRef.current && phaseRef.current === 'charging') {
        setPhase('charged');
      }
    }

    function tick() {
      const elapsed = performance.now() - (startTimeRef.current ?? 0);
      const timeProgress = Math.min(elapsed / MIN_MS, 1);
      setProgress((prev) => {
        const next = Math.max(prev, timeProgress);
        progressRef.current = next;
        return next;
      });
      maybeAdvance(elapsed);
      if (elapsed < MIN_MS || !loadedRef.current) {
        tickRafRef.current = requestAnimationFrame(tick);
      }
    }

    function onLoad() {
      loadedRef.current = true;
      const elapsed = performance.now() - (startTimeRef.current ?? 0);
      maybeAdvance(elapsed);
    }

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad, { once: true });
    }

    tickRafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(tickRafRef.current);
      window.removeEventListener('load', onLoad);
      document.body.style.overflow = '';
    };
  }, []);

  // charged → firing after 200ms hold
  useEffect(() => {
    if (phase !== 'charged') return;
    const t = setTimeout(() => setPhase('firing'), 200);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#0b1220', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#29b6e8', fontFamily: 'var(--font-poppins)', fontSize: '1rem' }}>
        {Math.round(progress * 100)}%
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Modify `app/layout.tsx` — mount Preloader**

```tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import NodeGraph from "@/components/NodeGraph";
import Preloader from "@/components/Preloader";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mohamed Yahia Gazzeh — Software Engineering Student",
  description:
    "Personal portfolio of Mohamed Yahia Gazzeh, software engineering student at ENSI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col">
        <Preloader />
        <NodeGraph />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Start dev server and verify**

```bash
npm run dev
```

Open `http://localhost:3000`. Confirm:
- Dark `#0b1220` overlay covers full screen
- Percentage counts up 0→100% over ~2.5s
- After ~2.5s, phase advances to `charged` then `firing` — overlay stays (beam exit not wired yet, that's fine)
- Scroll is locked during overlay

- [ ] **Step 4: Commit**

```bash
git add components/Preloader.tsx app/layout.tsx
git commit -m "feat(preloader): shell with state machine, progress tracking, scroll lock"
```

---

### Task 2: SVG warrior silhouette + reactive orb

**Files:**
- Modify: `components/Preloader.tsx`

**Interfaces:**
- Consumes: `progress: number` (0–1)
- Produces: `WarriorSVG` subcomponent — warrior silhouette with orb that scales/glows with progress

- [ ] **Step 1: Add `WarriorSVG` above the `Preloader` function**

```tsx
function WarriorSVG({ progress }: { progress: number }) {
  const orbRadius = 12 + progress * 22;      // 12 → 34
  const orbOpacity = 0.3 + progress * 0.7;   // 0.3 → 1.0
  const glowBlur = 6 + progress * 18;        // 6 → 24
  const glowRadius = orbRadius * 2.8;
  const figureGlowOpacity = 0.4 * progress;

  return (
    <svg
      viewBox="0 0 300 420"
      width="300"
      height="420"
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <filter id="orb-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={glowBlur} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="figure-glow" x="-20%" y="-10%" width="140%" height="120%">
          <feGaussianBlur in="SourceAlpha" stdDeviation={4 + progress * 8} result="blur" />
          <feFlood floodColor="#29b6e8" floodOpacity={figureGlowOpacity} result="color" />
          <feComposite in="color" in2="blur" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="orb-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#29b6e8" />
          <stop offset="100%" stopColor="#1565c0" />
        </radialGradient>
      </defs>

      {/* Orb glow halo behind figure */}
      <circle
        cx="150"
        cy="232"
        r={glowRadius}
        fill="#1565c0"
        opacity={orbOpacity * 0.35}
        filter="url(#orb-glow)"
      />

      {/* Warrior silhouette — original design, wide ki-charge stance */}
      <g fill="black" filter="url(#figure-glow)">
        {/* Head */}
        <circle cx="150" cy="45" r="28" />
        {/* Neck */}
        <rect x="138" y="70" width="24" height="18" />
        {/* Torso */}
        <polygon points="78,86 222,86 192,175 108,175" />
        {/* Left upper arm */}
        <polygon points="78,86 58,94 22,152 54,164" />
        {/* Left forearm — angled toward center below waist */}
        <polygon points="22,152 54,164 96,220 68,224" />
        {/* Right upper arm */}
        <polygon points="222,86 242,94 278,152 246,164" />
        {/* Right forearm — angled toward center below waist */}
        <polygon points="278,152 246,164 204,220 232,224" />
        {/* Left hand cupped */}
        <ellipse cx="80" cy="228" rx="20" ry="10" />
        {/* Right hand cupped */}
        <ellipse cx="220" cy="228" rx="20" ry="10" />
        {/* Left thigh — wide stance angled outward */}
        <polygon points="108,175 150,175 138,272 92,272" />
        {/* Right thigh */}
        <polygon points="150,175 192,175 208,272 162,272" />
        {/* Left shin */}
        <polygon points="92,272 138,272 128,365 80,365" />
        {/* Right shin */}
        <polygon points="162,272 208,272 220,365 174,365" />
        {/* Left foot */}
        <ellipse cx="96" cy="374" rx="32" ry="11" />
        {/* Right foot */}
        <ellipse cx="204" cy="374" rx="32" ry="11" />
      </g>

      {/* Energy orb between cupped hands */}
      <circle
        cx="150"
        cy="232"
        r={orbRadius}
        fill="url(#orb-grad)"
        opacity={orbOpacity}
        filter="url(#orb-glow)"
      />
    </svg>
  );
}
```

- [ ] **Step 2: Replace placeholder `<p>` with `WarriorSVG` in `Preloader` return**

Replace:
```tsx
<p style={{ color: '#29b6e8', fontFamily: 'var(--font-poppins)', fontSize: '1rem' }}>
  {Math.round(progress * 100)}%
</p>
```

With:
```tsx
<WarriorSVG progress={progress} />
```

- [ ] **Step 3: Verify visually**

Refresh `http://localhost:3000`. Confirm:
- Black warrior silhouette centered on dark bg
- Cyan orb between the hands, dim at start
- Orb grows and brightens over 2.5s
- Cyan aura glow around figure intensifies with progress

- [ ] **Step 4: Commit**

```bash
git add components/Preloader.tsx
git commit -m "feat(preloader): SVG warrior silhouette with reactive orb"
```

---

### Task 3: Canvas particles + glow bloom

**Files:**
- Modify: `components/Preloader.tsx`

**Interfaces:**
- Consumes: `progressRef.current` (0–1), `canvasRef`, `particlesRef`
- Produces: Canvas 2D loop — rising cyan particles + radial glow bloom; canvas mounted behind SVG

- [ ] **Step 1: Add canvas RAF `useEffect` in `Preloader` (after existing effects)**

```tsx
// Canvas particle loop
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = particlesRef.current;
  let frameCount = 0;

  function spawnParticle() {
    if (!canvas) return;
    const cx = canvas.width / 2;
    // Orb is at SVG y=232 inside 420-tall SVG centered on screen.
    // Offset from SVG center (y=210) to orb: 232-210 = +22px
    const cy = canvas.height / 2 + 22;
    const angle = Math.random() * Math.PI * 2;
    const dist = 15 + Math.random() * 30;
    particles.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * 1.4,
      vy: -(1.5 + Math.random() * 2.5),
      alpha: 0.7 + Math.random() * 0.3,
      radius: 1.5 + Math.random() * 3,
      hue: 185 + Math.random() * 30, // cyan range
    });
  }

  function draw() {
    if (!canvas || !ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2 + 22;
    const prog = progressRef.current;

    // Radial glow bloom behind figure
    const bloomR = 80 + prog * 180;
    const bloom = ctx.createRadialGradient(cx, cy - 80, 0, cx, cy - 80, bloomR);
    bloom.addColorStop(0, `rgba(41,182,232,${0.18 * prog})`);
    bloom.addColorStop(0.5, `rgba(21,101,192,${0.1 * prog})`);
    bloom.addColorStop(1, 'rgba(21,101,192,0)');
    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(cx, cy - 80, bloomR, 0, Math.PI * 2);
    ctx.fill();

    // Spawn particles — more frequent as progress increases
    frameCount++;
    const spawnEvery = Math.max(2, Math.round(10 - prog * 8));
    if (frameCount % spawnEvery === 0 && particles.length < 80) {
      spawnParticle();
    }

    // Update + draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.007;
      if (p.alpha <= 0 || p.y < -10) {
        particles.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},90%,75%,${p.alpha})`;
      ctx.fill();
    }

    canvasRafRef.current = requestAnimationFrame(draw);
  }

  canvasRafRef.current = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(canvasRafRef.current);
    window.removeEventListener('resize', resize);
  };
}, []); // eslint-disable-line react-hooks/exhaustive-deps
```

- [ ] **Step 2: Update `Preloader` return to include canvas behind SVG**

Replace current return with:

```tsx
return (
  <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#0b1220' }}>
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    />
    <div
      ref={overlayRef}
      style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <WarriorSVG progress={progress} />
    </div>
  </div>
);
```

- [ ] **Step 3: Verify visually**

Refresh. Confirm:
- Cyan particles rise from around the orb
- Particle density increases as progress advances
- Blue/cyan radial bloom grows behind figure
- Canvas fills full screen with no layout shift

- [ ] **Step 4: Commit**

```bash
git add components/Preloader.tsx
git commit -m "feat(preloader): canvas particles and radial glow bloom"
```

---

### Task 4: Screen shake

**Files:**
- Modify: `components/Preloader.tsx`

**Interfaces:**
- Consumes: `progressRef.current`, `phaseRef.current`, `overlayRef`
- Produces: inner content div shakes with amplitude 0→4px starting at 70% progress, stops on `firing`

- [ ] **Step 1: Add shake logic inside canvas `draw` function**

At the end of the `draw` function body (before `canvasRafRef.current = requestAnimationFrame(draw)`), add:

```tsx
// Screen shake — applied directly to DOM via ref to avoid setState per frame
if (prog > 0.7 && phaseRef.current === 'charging') {
  const amplitude = ((prog - 0.7) / 0.3) * 4; // 0→4px
  const now = Date.now();
  const sx = Math.sin(now * 0.025) * amplitude;
  const sy = Math.cos(now * 0.018) * amplitude * 0.6;
  if (overlayRef.current) {
    overlayRef.current.style.transform = `translate(${sx}px,${sy}px)`;
  }
} else if (overlayRef.current) {
  overlayRef.current.style.transform = 'translate(0,0)';
}
```

- [ ] **Step 2: Verify visually**

Refresh. At ~70% progress, the warrior + orb should begin to tremble. By 100% progress (~2.5s) the shake should be clearly visible (~4px). Canvas and background do not shake (shake is on the inner content div only, which is the intended effect).

- [ ] **Step 3: Commit**

```bash
git add components/Preloader.tsx
git commit -m "feat(preloader): screen shake scaling with charge progress"
```

---

### Task 5: Beam exit + AnimatePresence unmount

**Files:**
- Modify: `components/Preloader.tsx`

**Interfaces:**
- Consumes: `phase: Phase`, `beamFiredRef`
- Produces: white beam flash on `firing`, overlay removed, scroll unlocked, phase reaches `done`

- [ ] **Step 1: Wrap `Preloader` return in AnimatePresence + add beam flash**

Replace entire return statement with:

```tsx
return (
  <>
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="preloader-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeOut' } }}
          style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#0b1220' }}
        >
          <canvas
            ref={canvasRef}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          />
          <div
            ref={overlayRef}
            style={{
              position: 'relative',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <WarriorSVG progress={progress} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Beam flash — separate AnimatePresence so it outlives the overlay */}
    <AnimatePresence>
      {phase === 'firing' && (
        <motion.div
          key="beam-flash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: 'easeOut' } }}
          transition={{ duration: 0.08, ease: 'easeIn' }}
          onAnimationComplete={(definition) => {
            // Only advance on the enter animation, not the exit
            if (!beamFiredRef.current) {
              beamFiredRef.current = true;
              setPhase('done');
            }
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 52,
            background: '#ffffff',
            pointerEvents: 'none',
          }}
        />
      )}
    </AnimatePresence>
  </>
);
```

**Flow:**
1. `phase === 'firing'` → beam div enters (opacity 0→1 in 80ms)
2. Beam `animate` completes → `setPhase('done')` via `beamFiredRef` guard
3. `phase === 'done'` → overlay exits AnimatePresence (fade 250ms); beam exits AnimatePresence (fade 350ms)
4. Page revealed

- [ ] **Step 2: Verify full flow**

Refresh `http://localhost:3000`. Confirm end-to-end:
- Preloader covers screen during charge
- At 2.5s: orb at full brightness, shake at max
- Sudden white flash (80ms)
- Page revealed as white fades out (350ms)
- Scroll works after preloader gone
- DevTools Elements: no `.preloader` divs remain after exit

- [ ] **Step 3: Commit**

```bash
git add components/Preloader.tsx
git commit -m "feat(preloader): beam flash exit with AnimatePresence unmount"
```

---

### Task 6: Reduced motion branch

**Files:**
- Modify: `components/Preloader.tsx`

**Interfaces:**
- Consumes: `prefersReducedMotion: boolean | null` from `useReducedMotion()`
- Produces: When true — static SVG at full charge, animated `<progress>` bar, simple opacity fade exit; no particles, no shake, no beam

- [ ] **Step 1: Add reduced-motion early return in `Preloader`**

Add this block just before the `return (` statement (after all hooks, so hooks order is preserved):

```tsx
if (prefersReducedMotion) {
  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="preloader-reduced"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          onAnimationComplete={(def) => {
            if (def === 'exit') {
              // scroll already restored by main useEffect cleanup
            }
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            background: '#0b1220',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
          }}
        >
          <WarriorSVG progress={1} />
          <div style={{ width: '200px' }}>
            <progress
              value={progress}
              max={1}
              style={{
                width: '100%',
                height: '4px',
                accentColor: '#29b6e8',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

Note: `phase` transitions still happen normally (charging → charged → firing → done). The reduced-motion path watches `phase !== 'done'` to know when to exit via AnimatePresence. The `firing` phase change happens in 200ms after `charged` — that transition triggers `done` via the existing `useEffect`. But in reduced-motion we skip the beam and the firing phase jumps straight to done. Adjust the `charged → firing → done` chain to jump straight to done in reduced motion:

Modify the `charged` effect:

```tsx
useEffect(() => {
  if (phase !== 'charged') return;
  const t = setTimeout(() => {
    if (prefersReducedMotion) {
      setPhase('done');
    } else {
      setPhase('firing');
    }
  }, 200);
  return () => clearTimeout(t);
}, [phase, prefersReducedMotion]);
```

- [ ] **Step 2: Verify reduced motion**

In browser DevTools: Rendering tab → "Emulate CSS media feature prefers-reduced-motion: reduce".

Refresh. Confirm:
- Static warrior at full-charge pose (progress=1 passed to SVG)
- Progress bar fills over 2.5s
- No particles, no shake
- After 2.5s: simple opacity fade, page revealed
- No beam flash

- [ ] **Step 3: Commit**

```bash
git add components/Preloader.tsx
git commit -m "feat(preloader): reduced-motion branch with static pose and progress bar"
```

---

### Task 7: Final verification + polish

**Files:**
- Modify: `components/Preloader.tsx` (minor fixes only)

- [ ] **Step 1: Verify no hydration warnings**

```bash
npm run build && npm run start
```

Open `http://localhost:3000`. Check browser console for hydration errors. Expected: none.

- [ ] **Step 2: Verify scroll lock restored**

After preloader exits, scroll page. Confirm `document.body.style.overflow` is `""` (not `"hidden"`). Check in DevTools console: `document.body.style.overflow`.

- [ ] **Step 3: Verify no RAF leaks**

Open DevTools Performance tab. Record 10s after preloader exits. Confirm no `requestAnimationFrame` callbacks continuing to fire from the preloader.

- [ ] **Step 4: Verify z-index layering**

During preloader: `NodeGraph` canvas (behind), preloader overlay (z-50), beam flash (z-52). After exit: only `NodeGraph` and page content remain. Confirm in Elements panel.

- [ ] **Step 5: Verify on slow connection**

DevTools Network → Throttle to "Slow 3G". Confirm preloader stays until both 2.5s AND `window load` have fired. Progress should reflect real load, not just elapsed time.

- [ ] **Step 6: Fix any issues found, then commit**

```bash
git add components/Preloader.tsx
git commit -m "fix(preloader): post-verification polish"
```
